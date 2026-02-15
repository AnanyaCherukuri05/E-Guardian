"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSent(true);
            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12">
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>

                <div className="text-center mb-10">
                    {sent ? (
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 rounded-full p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 rounded-full p-4">
                                <Mail className="h-12 w-12 text-blue-600" />
                            </div>
                        </div>
                    )}
                    
                    <h1 className="text-3xl font-bold text-gray-900">
                        {sent ? 'OTP Sent!' : 'Forgot Password?'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {sent 
                            ? 'Check your email for the OTP code'
                            : 'No worries! Enter your email and we\'ll send you an OTP'}
                    </p>
                </div>

                {sent ? (
                    <div className="space-y-6">
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                            <p className="text-green-900 text-center">
                                <strong>OTP sent to:</strong><br />
                                <span className="text-green-700">{email}</span>
                            </p>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                            <p className="text-sm text-blue-900 text-center">
                                📧 Check your inbox and spam folder<br />
                                🕐 OTP expires in 10 minutes<br />
                                🔐 Keep your OTP confidential
                            </p>
                        </div>

                        <p className="text-center text-gray-600 text-sm">
                            Redirecting to password reset page...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    Send OTP
                                    <Send className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
                            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                💡 What happens next?
                            </h3>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>• We'll send a 6-digit OTP to your email</li>
                                <li>• Enter the OTP on the next page</li>
                                <li>• Create a new secure password</li>
                                <li>• Login with your new password</li>
                            </ul>
                        </div>
                    </form>
                )}

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Remember your password? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
