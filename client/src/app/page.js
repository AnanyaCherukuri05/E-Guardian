"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, ShieldAlert, Zap, MapPin, ArrowRight, Activity, Globe, Sparkles, Cpu, AlertCircle, Leaf, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const ImpactStats = () => {
    const [stats, setStats] = useState({ totalDevices: 1240, co2Saved: 3100, highHazardDevices: 450 });

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const res = await api.get('/devices/stats');
                if (res.data) setStats(res.data);
            } catch (err) {
                // Fallback to mock if API fails
            }
        };
        fetchGlobalStats();
    }, []);

    const statItems = [
        { label: 'Scans Performed', value: stats.totalDevices, icon: Activity, suffix: '+' },
        { label: 'CO₂ Prevented', value: stats.co2Saved, icon: Globe, suffix: 'kg' },
        { label: 'Hazards Contained', value: stats.highHazardDevices, icon: ShieldAlert, suffix: '' },
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-green-600/5 -skew-y-3 origin-right transform scale-110" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        Real-Time Impact Tracking
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join thousands of eco-guardians making a measurable difference every single day through smart recycling.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-xl shadow-green-900/5 group text-center"
                        >
                            <div className="inline-flex p-4 rounded-2xl bg-green-50 text-green-600 mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="h-8 w-8" />
                            </div>
                            <div className="text-4xl font-black text-gray-900 mb-2">
                                <span className="tabular-nums">{item.value}</span>
                                <span className="text-green-600">{item.suffix}</span>
                            </div>
                            <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">{item.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#fcfdfd] selection:bg-green-100 selection:text-green-900">
            {/* Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-green-200/20 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-200/20 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm mb-8"
                    >
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Next-Gen Environmental Protection</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8"
                    >
                        Scan Web. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Shape Earth.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12"
                    >
                        Harness the power of AI to identify hazardous waste, get smart recycling recommendations, and contribute to a cleaner planet in seconds.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/scan"
                            className="group relative px-8 py-5 bg-gray-900 text-white font-bold rounded-2xl overflow-hidden active:scale-95 transition-all shadow-2xl shadow-gray-200 w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                Start Smart Scan <Recycle className="h-5 w-5" />
                            </span>
                        </Link>
                        <Link
                            href="/map"
                            className="px-8 py-5 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            Find Disposal Centers <MapPin className="h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
                        {[
                            {
                                title: 'AI-Powered Detection',
                                desc: 'Advanced neural networks analyze your images to pinpoint toxic components and device specifics.',
                                icon: Cpu,
                                color: 'text-amber-600',
                                bg: 'bg-amber-100'
                            },
                            {
                                title: 'Hazard Assessment',
                                desc: 'Get detailed safety protocols for lithium, lead, and mercury containment with expert guides.',
                                icon: AlertTriangle,
                                color: 'text-red-600',
                                bg: 'bg-red-100'
                            },
                            {
                                title: 'Eco-Incentives',
                                desc: 'Find verified recycling hubs and track your personal footprint reduction over time.',
                                icon: Leaf,
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-100'
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 rounded-[2.5rem] bg-white border border-gray-100/50 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500"
                            >
                                <div className={cn("inline-flex p-5 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-black/5", feature.bg)}>
                                    <feature.icon className={cn("h-10 w-10", feature.color)} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                                <div className="mt-8 pt-8 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-bold text-gray-900 inline-flex items-center gap-2">
                                        Learn more <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <ImpactStats />

            {/* Premium CTA */}
            <section className="py-32 px-4 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-green-900/20"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent)]" />

                    <Recycle className="h-20 w-20 text-green-500 mx-auto mb-10 animate-pulse" />
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 italic">
                        The planet doesn't <br />
                        have a reset button.
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
                        "Over 50 million metric tons of e-waste is produced annually. Only 20% is formally recycled. Together, we can change that."
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 font-bold rounded-2xl hover:bg-green-50 hover:scale-105 active:scale-95 transition-all"
                    >
                        Join the Movement Now <ArrowRight className="h-5 w-5" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}

