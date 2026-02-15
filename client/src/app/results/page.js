"use client";
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Loader2, ShieldAlert, Recycle, Info, AlertTriangle, Leaf, DollarSign, Component, Package } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-green-600" /></div>;
    if (!user) return null;

    const latest = devices[0];

    if (!latest) {
        return (
            <div className="min-h-screen pt-32 text-center px-4">
                <ShieldCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Recent Scans Found</h1>
                <p className="text-gray-600 mb-8">Start by scanning your first electronic device.</p>
                <Link href="/scan" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                    Go to Scan
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 to-green-50">
            <div className="max-w-7xl mx-auto px-4">
                <Link href="/scan" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowRight className="h-4 w-4" /> Back to Scanner
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Result Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{latest.name}</h1>
                                    <p className="text-gray-500">{latest.category}</p>
                                </div>
                                <div className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
                                    latest.hazardLevel === 'High' ? "bg-red-100 text-red-700" : 
                                    latest.hazardLevel === 'Medium' ? "bg-yellow-100 text-yellow-700" :
                                    "bg-green-100 text-green-700"
                                )}>
                                    {latest.hazardLevel} Hazard
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-blue-600" /> AI Analysis Summary
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{latest.classificationResults}</p>
                            </div>
                        </div>

                        {/* Hazardous Materials Card */}
                        {latest.hazardousMaterials && latest.hazardousMaterials.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-red-600" /> Hazardous Materials Detected
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {latest.hazardousMaterials.map((material, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                            <span className="text-sm font-medium text-red-900">{material}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Environmental Impact Card */}
                        {latest.environmentalImpact && (
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-600" /> Environmental Impact
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">{latest.environmentalImpact}</p>
                                {latest.carbonFootprint && (
                                    <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                        <p className="text-sm font-medium text-green-900">
                                            <strong>Carbon Impact:</strong> {latest.carbonFootprint}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Component Breakdown Card */}
                        {latest.componentBreakdown && (
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Component className="h-5 w-5 text-purple-600" /> Component Breakdown
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{latest.componentBreakdown}</p>
                                {latest.estimatedValue && (
                                    <div className="mt-4 p-4 bg-purple-50 rounded-xl flex items-center gap-3">
                                        <DollarSign className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium text-purple-900">Recyclable Material Value</p>
                                            <p className="text-sm text-purple-700">{latest.estimatedValue}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Safety Precautions Card */}
                        {latest.safetyPrecautions && latest.safetyPrecautions.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-orange-600" /> Safety Precautions
                                </h3>
                                <ul className="space-y-3">
                                    {latest.safetyPrecautions.map((precaution, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{precaution}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Recycling Steps Card */}
                        {latest.recyclingSteps && latest.recyclingSteps.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Recycle className="h-5 w-5 text-green-600" /> Detailed Recycling Guide
                                </h3>
                                <ol className="space-y-4">
                                    {latest.recyclingSteps.map((step, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <p className="text-gray-700 pt-1">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* Disposal Warnings Card */}
                        {latest.disposalWarnings && latest.disposalWarnings.length > 0 && (
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-xl p-8 border border-red-200">
                                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" /> Critical Disposal Warnings
                                </h3>
                                <ul className="space-y-3">
                                    {latest.disposalWarnings.map((warning, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border-l-4 border-red-500">
                                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                            <span className="text-gray-800 font-medium">{warning}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Action Card */}
                        <Link href="/map" className="block p-6 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-3xl hover:from-green-700 hover:to-green-800 transition-all group shadow-xl">
                            <Package className="h-12 w-12 mb-4 text-green-200" />
                            <h3 className="font-bold text-xl mb-2">Find Recycling Center</h3>
                            <p className="text-green-100 text-sm mb-4">Locate certified e-waste recyclers near you who can safely handle this {latest.name}.</p>
                            <div className="flex items-center gap-2 text-green-200 font-medium">
                                View Map <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Impact Stats Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-green-600" /> Your Impact
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-xl">
                                    <p className="text-2xl font-bold text-green-700">{devices.length}</p>
                                    <p className="text-sm text-gray-600">Devices Scanned</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl">
                                    <p className="text-2xl font-bold text-blue-700">{(devices.length * 2.5).toFixed(1)} kg</p>
                                    <p className="text-sm text-gray-600">Est. CO₂ Saved</p>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-gradient-to-br from-gray-900 to-green-900 text-white rounded-3xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5 text-green-400" /> Did You Know?
                            </h3>
                            <div className="space-y-4 text-gray-200 text-sm">
                                <p>Recycling one million laptops saves energy equivalent to powering 3,500 homes for a year.</p>
                                <div className="pt-4 border-t border-gray-700">
                                    <h4 className="font-bold text-white mb-2">💡 Pro Tip</h4>
                                    <p>If your device still works, consider donating it to schools, charities, or refurbishment programs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
