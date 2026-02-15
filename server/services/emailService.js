const nodemailer = require('nodemailer');

/**
 * Email Service for E-Guardian
 * Handles all email communications including OTP, notifications, etc.
 * Development mode: Displays OTP in console if email credentials not configured
 */

// Mock email display for development
const mockSendEmail = (email, subject, otp) => {
    console.log('\n' + '='.repeat(70));
    console.log('📧 EMAIL NOTIFICATION (Development Mode)');
    console.log('='.repeat(70));
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log('-'.repeat(70));
    console.log(`\n🔐 OTP CODE: ${otp}`);
    console.log('\n⏱️ Valid for 10 minutes');
    console.log('='.repeat(70) + '\n');
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
    try {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn('⚠️ Email credentials not configured. Displaying OTP in console.');
            mockSendEmail(email, 'Password Reset OTP', otp);
            return true;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `"E-Guardian" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP - E-Guardian',
            html: `
                <!DOCTYPE html>
                <html><head><style>
                    body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
                    .container{max-width:600px;margin:0 auto;padding:20px}
                    .header{background:linear-gradient(135deg,#059669 0%,#10b981 100%);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}
                    .content{background:#f9fafb;padding:30px;border-radius:0 0 10px 10px}
                    .otp-box{background:white;border:2px dashed #10b981;border-radius:10px;padding:20px;text-align:center;margin:20px 0}
                    .otp{font-size:32px;font-weight:bold;color:#059669;letter-spacing:5px}
                </style></head><body>
                    <div class="container">
                        <div class="header"><h1>🔒 Password Reset Request</h1></div>
                        <div class="content">
                            <p>Hello <strong>${name}</strong>,</p>
                            <p>We received a request to reset your password. Use the OTP below:</p>
                            <div class="otp-box">
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your One-Time Password</p>
                                <div class="otp">${otp}</div>
                                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">Valid for 10 minutes</p>
                            </div>
                            <p>If you didn't request this, please ignore this email.</p>
                        </div>
                    </div>
                </body></html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        // Fall back to console display
        mockSendEmail(email, 'Password Reset OTP', otp);
        return true;
    }
};

// Send confirmation email
const sendPasswordResetConfirmation = async (email, name) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return true;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"E-Guardian" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Successful',
            html: `<p>Hello ${name}, your password has been reset successfully.</p>`
        });
        return true;
    } catch (error) {
        console.error('❌ Confirmation email error:', error.message);
        return false;
    }
};

// Send general notification
const sendNotificationEmail = async (email, name, subject, message, type = 'info') => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return true;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"E-Guardian" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `${subject} - E-Guardian`,
            html: `<p>Hello ${name},</p>${message}`
        });
        return true;
    } catch (error) {
        console.error('❌ Notification email error:', error.message);
        throw error;
    }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
    return sendNotificationEmail(
        email,
        name,
        'Welcome to E-Guardian',
        '<p>Welcome to our platform!</p>',
        'success'
    );
};

module.exports = {
    generateOTP,
    sendOTPEmail,
    sendPasswordResetConfirmation,
    sendNotificationEmail,
    sendWelcomeEmail
};
