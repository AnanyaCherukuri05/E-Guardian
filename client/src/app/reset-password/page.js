"use client";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Lock, Loader2, ArrowLeft, CheckCircle2, KeyRound, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    const handleResendOTP = async () => {
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        setResendLoading(true);
        try {
            await api.post('/auth/resend-otp', { email });
            alert('New OTP sent to your email!');
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12">
                <Link href="/forgot-password" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>

                <div className="text-center mb-10">
                    {success ? (
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 rounded-full p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-4">
                            <div className="bg-purple-100 rounded-full p-4">
                                <KeyRound className="h-12 w-12 text-purple-600" />
                            </div>
                        </div>
                    )}
                    
                    <h1 className="text-3xl font-bold text-gray-900">
                        {success ? 'Password Reset!' : 'Reset Password'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {success 
                            ? 'Your password has been updated successfully'
                            : 'Enter the OTP and create a new password'}
                    </p>
                </div>

                {success ? (
                    <div className="space-y-6">
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                            <p className="text-green-900 text-center">
                                ✅ Password reset successfully!<br />
                                <span className="text-green-700">You can now login with your new password.</span>
                            </p>
                        </div>

                        <p className="text-center text-gray-600 text-sm">
                            Redirecting to login page...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium text-center text-2xl tracking-widest"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendLoading}
                                className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
                            >
                                {resendLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Resending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4" />
                                        Resend OTP
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="New password (min 6 characters)"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-600 text-sm text-center">❌ Passwords do not match</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword}
                            className="w-full bg-purple-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <CheckCircle2 className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                            <h3 className="font-bold text-blue-900 mb-2">🔐 Password Tips:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• At least 6 characters long</li>
                                <li>• Mix of letters and numbers</li>
                                <li>• Use special characters for extra security</li>
                                <li>• Don't reuse old passwords</li>
                            </ul>
                        </div>
                    </form>
                )}

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Remember your password? <Link href="/login" className="text-purple-600 font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-12 w-12 text-purple-600" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
