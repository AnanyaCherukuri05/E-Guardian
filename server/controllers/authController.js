const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPEmail, sendPasswordResetConfirmation } = require('../services/emailService');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Name, email, and password are required' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT secret is not configured' });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    } catch (err) {
        console.error('Register error:', err);
        if (err && err.code === 11000) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: err.message || 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT secret is not configured' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: err.message || 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Send OTP to user's email for password reset
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal that user doesn't exist for security
            return res.status(200).json({ msg: 'If the email exists, an OTP has been sent' });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Set OTP expiration (10 minutes)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to user
        user.resetOTP = otp;
        user.resetOTPExpires = otpExpires;
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, user.name, otp);

        res.status(200).json({ 
            msg: 'OTP sent to your email',
            email: email 
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ msg: 'Failed to send OTP. Please try again.' });
    }
};

/**
 * Verify OTP and reset password
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ msg: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if OTP exists
        if (!user.resetOTP || !user.resetOTPExpires) {
            return res.status(400).json({ msg: 'No password reset request found. Please request a new OTP.' });
        }

        // Check if OTP has expired
        if (new Date() > user.resetOTPExpires) {
            user.resetOTP = undefined;
            user.resetOTPExpires = undefined;
            await user.save();
            return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        if (user.resetOTP !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }

        // Update password
        user.password = newPassword;
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;
        await user.save();

        // Send confirmation email
        try {
            await sendPasswordResetConfirmation(email, user.name);
        } catch (emailErr) {
            console.error('Failed to send confirmation email:', emailErr);
            // Don't fail the request if email fails
        }

        res.status(200).json({ msg: 'Password reset successfully. You can now login with your new password.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ msg: 'Failed to reset password. Please try again.' });
    }
};

/**
 * Resend OTP
 */
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ msg: 'If the email exists, a new OTP has been sent' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOTP = otp;
        user.resetOTPExpires = otpExpires;
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, user.name, otp);

        res.status(200).json({ msg: 'New OTP sent to your email' });
    } catch (err) {
        console.error('Resend OTP error:', err);
        res.status(500).json({ msg: 'Failed to resend OTP. Please try again.' });
    }
};
