"use client";
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Loader2, ShieldAlert, Recycle, Info, FlaskConical, Beaker, Factory, Leaf } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ResultsPage() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        const fetchResults = async () => {
            try {
                const res = await api.get('/devices');
                setDevices(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin h-12 w-12 text-green-600" /></div>;
    if (!user) return null;

    const latest = devices[0];

    if (!latest) {
        return (
            <div className="min-h-screen pt-32 text-center px-4 bg-gray-50">
                <ShieldCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Recent Scans Found</h1>
                <p className="text-gray-600 mb-8">Start by scanning your first electronic device.</p>
                <Link href="/scan" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg">
                    Go to Scan
                </Link>
            </div>
        );
    }

    const { detailedData } = latest;
    const hasDetailed = detailedData && Object.keys(detailedData).length > 0;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#f8fafc]">
            <div className="max-w-5xl mx-auto px-4">
                <Link href="/scan" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 transition-all font-medium group">
                    <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Scanner
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-[5rem] blur-2xl" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                                <div>
                                    <div className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest mb-4">
                                        Scan Confirmed
                                    </div>
                                    <h1 className="text-4xl font-black text-gray-900 mb-2">{latest.name}</h1>
                                    <p className="text-gray-500 font-medium flex items-center gap-2">
                                        Category: <span className="text-gray-900">{latest.category}</span>
                                    </p>
                                </div>
                                <div className={cn(
                                    "px-6 py-4 rounded-2xl flex flex-col items-center justify-center border-2",
                                    latest.hazardLevel === 'High' ? "bg-red-50/50 border-red-100 text-red-600" : "bg-green-50/50 border-green-100 text-green-600"
                                )}>
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70 mb-1">Hazard Level</span>
                                    <span className="text-xl font-black italic">{latest.hazardLevel}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* In-Depth Hazard Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10"
                        >
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <FlaskConical className="h-7 w-7 text-amber-500" />
                                Chemical Hazard Profile
                            </h2>

                            {hasDetailed ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {detailedData.hazards.map((hazard, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black text-amber-600 shadow-sm">
                                                    {hazard.element[0]}
                                                </div>
                                                <h4 className="font-black text-gray-900 uppercase tracking-tight">{hazard.element}</h4>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed font-medium">{hazard.risk}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <Beaker className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Detailed chemical mapping not available for this specific category yet.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Processing Lifecycle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10"
                        >
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <Factory className="h-7 w-7 text-green-600" />
                                Step-by-Step Recycling Lifecycle
                            </h2>

                            <div className="relative pl-8 space-y-10">
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-500 to-green-100" />

                                {(hasDetailed ? detailedData.process : latest.recommendations).map((step, i) => (
                                    <div key={i} className="relative group">
                                        <div className="absolute -left-[2.15rem] top-1 h-3 w-3 rounded-full bg-white border-2 border-green-500 group-hover:scale-150 transition-transform" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-green-600 mb-1">Phase 0{i + 1}</span>
                                            <p className="text-gray-700 font-bold leading-relaxed">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 rounded-full blur-3xl" />
                            <Leaf className="h-10 w-10 text-green-400 mb-6" />
                            <h3 className="text-xl font-black mb-4 italic tracking-tight">Environmental Impact Summary</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Proper recycling of this {latest.name} prevents approximately <span className="text-green-400 font-black">2.5kg</span> of CO₂ emissions from entering the atmosphere.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10 text-xs text-gray-500 uppercase font-black tracking-widest">
                                Your Status: Eco-Guardian
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-green-200 transition-all cursor-pointer"
                        >
                            <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ArrowRight className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Locate Treatment Facility</h3>
                            <Link href="/map" className="text-sm text-gray-500 hover:text-green-600 transition-colors font-medium">
                                Find the nearest verified hazardous waste center for safe disposal →
                            </Link>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
