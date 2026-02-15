"use client";
import { useEffect, useState } from 'react';
import { BarChart3, Recycle, ShieldAlert, Leaf, History, TrendingUp, LayoutDashboard, Zap, Loader2, Award, Activity } from 'lucide-react';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalDevices: 0,
        highHazardDevices: 0,
        co2Saved: 0,
        impactScore: 0,
        dailyActivity: []
    });
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
        const fetchData = async () => {
            try {
                const [statsRes, devicesRes] = await Promise.all([
                    api.get('/devices/stats'),
                    api.get('/devices')
                ]);
                setStats(statsRes.data);
                setDevices(devicesRes.data);
            } catch (err) {
                console.error('Dashboard Data Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            </div>
        );
    }

    if (!user) return null;

    const chartData = stats.dailyActivity?.length > 0 ? stats.dailyActivity : [
        { name: 'Mon', count: 0 }, { name: 'Tue', count: 0 }, { name: 'Wed', count: 0 },
        { name: 'Thu', count: 0 }, { name: 'Fri', count: 0 }, { name: 'Sat', count: 0 }, { name: 'Sun', count: 0 }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Eco-Guardian Dashboard</h1>
                        <p className="text-gray-500 font-medium mt-1">Real-time environmental impact analysis for <span className="text-green-600 font-bold">{user.username}</span></p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] font-black uppercase text-gray-400 leading-none">Global Rank</p>
                            <p className="text-sm font-black text-gray-900 leading-tight">Top 5%</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Devices Scanned', value: stats.totalDevices, icon: LayoutDashboard, color: 'text-amber-600', bg: 'bg-amber-100', detail: '+2 this week' },
                        { label: 'CO2 Saved (kg)', value: stats.co2Saved.toFixed(1), icon: Leaf, color: 'text-green-600', bg: 'bg-green-100', detail: 'Lifetime offset' },
                        { label: 'Hazardous Waste', value: stats.highHazardDevices, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100', detail: 'Critical containment' },
                        { label: 'Impact Score', value: stats.impactScore, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100', detail: 'Dynamic score' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            <div className={`p-4 rounded-2xl inline-block mb-6 ${stat.bg} group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className={`h-7 w-7 ${stat.color}`} />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                                <span className="text-[10px] font-bold text-gray-400">{stat.detail}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Weekly Activity */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <Activity className="h-6 w-6 text-green-600" />
                                Weekly Activity Tracking
                            </h3>
                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Live Feed
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dx={-10} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                                    />
                                    <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={45}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent History */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <History className="h-6 w-6 text-green-600" />
                                Recent Scans
                            </h3>
                        </div>
                        <div className="space-y-6 relative">
                            {devices.length > 0 ? devices.slice(0, 6).map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                                >
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border group-hover:scale-110 transition-transform ${item.hazardLevel === 'High' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                                        {item.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-gray-900 truncate tracking-tight">{item.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                    </div>
                                    <div className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${item.hazardLevel === 'High' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-green-100 border-green-200 text-green-700'}`}>
                                        {item.hazardLevel}
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="py-20 text-center">
                                    <Zap className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium text-sm">No activity recorded yet.</p>
                                </div>
                            )}
                        </div>
                        {devices.length > 6 && (
                            <Link href="/results" className="block mt-8 text-center text-xs font-black text-green-600 uppercase tracking-widest hover:text-green-700 transition-colors">
                                View Entire History →
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
