'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaMoneyBillWave, FaTicketAlt, FaShoppingBag, FaArrowUp, FaArrowDown, FaCalendarAlt, FaStar } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/layouts/AdminSidebar'
import SalesChart from '@/components/charts/SalesChart'
import StatCard from '@/components/ui/StatCard'
import Spinner from '@/components/ui/Spinner'
import { fadeInUp, staggerChildren } from '@/lib/utils/animations'
import { formatCurrency } from '@/lib/utils/format'
import ClientTitle from '@/components/ui/ClientTitle'

const mockSalesData = [
    { date: '1 Feb', amount: 4500 },
    { date: '5 Feb', amount: 3200 },
    { date: '10 Feb', amount: 8900 },
    { date: '15 Feb', amount: 12400 },
    { date: '20 Feb', amount: 9800 },
    { date: '25 Feb', amount: 15600 },
    { date: '28 Feb', amount: 14200 },
]

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalUsers: 0,
        activeTickets: 0,
        totalProducts: 0
    })
    const [salesData, setSalesData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchStats = async () => {
        setLoading(true)
        const [usersRes, ticketsRes, productsRes, paymentsRes] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('tickets').select('*', { count: 'exact', head: true }),
            supabase.from('store_items').select('*', { count: 'exact', head: true }),
            supabase.from('payments').select('amount, created_at').eq('status', 'completed')
        ])

        const payments = paymentsRes.data || [];
        const totalSales = payments.reduce((acc, p) => acc + p.amount, 0);

        // Generate chart data for last 7 days from real payments
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const grouped = payments.reduce((acc: any, p: any) => {
            const dateStr = new Date(p.created_at).toISOString().split('T')[0];
            acc[dateStr] = (acc[dateStr] || 0) + p.amount;
            return acc;
        }, {});

        const chartData = last7Days.map(date => {
            const parts = date.split('-');
            // Get day and month short
            return {
                date: `${parts[2]}/${parts[1]}`,
                amount: grouped[date] || 0
            };
        });

        setSalesData(chartData);

        setStats({
            totalSales,
            totalUsers: usersRes.count || 0,
            activeTickets: ticketsRes.count || 0,
            totalProducts: productsRes.count || 0
        })
        setLoading(false)
    }

    useEffect(() => {
        fetchStats()
    }, [])


    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <ClientTitle title="لوحة التحكم" />
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12">
                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    animate="animate"
                    className="max-w-7xl mx-auto space-y-12"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">مرحباً بك يا مدير <span className="text-primary">تذكرتي</span></h1>
                            <p className="text-gray-500">هنا نظرة شاملة على أداء منصتك لهذا الشهر.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="card-glass px-6 py-3 flex items-center gap-3 text-sm font-bold border-l-4 border-primary">
                                <FaCalendarAlt className="text-primary" /> فبراير 2026
                            </div>
                            <button onClick={fetchStats} className="btn-primary p-3 !rounded-xl">تحديث</button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="card-glass p-8 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl">
                                    <FaMoneyBillWave />
                                </div>
                                <div className="flex items-center gap-1 text-green-500 text-xs font-black">
                                    <FaArrowUp /> 12%
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 font-bold text-xs uppercase mb-1">إجمالي المبيعات</h3>
                                <div className="text-3xl font-black text-white">
                                    {loading ? <div className="h-9 w-32 bg-white/5 animate-pulse rounded-lg" /> : formatCurrency(stats.totalSales)}
                                </div>
                            </div>
                        </div>

                        <div className="card-glass p-8 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 text-xl">
                                    <FaUsers />
                                </div>
                                <div className="flex items-center gap-1 text-green-500 text-xs font-black">
                                    <FaArrowUp /> 8%
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 font-bold text-xs uppercase mb-1">المستخدمين</h3>
                                <div className="text-3xl font-black text-white">
                                    {loading ? <div className="h-9 w-32 bg-white/5 animate-pulse rounded-lg" /> : stats.totalUsers.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="card-glass p-8 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 text-xl">
                                    <FaTicketAlt />
                                </div>
                                <div className="flex items-center gap-1 text-red-500 text-xs font-black">
                                    <FaArrowDown /> 4%
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 font-bold text-xs uppercase mb-1">تذاكر نشطة</h3>
                                <div className="text-3xl font-black text-white">
                                    {loading ? <div className="h-9 w-32 bg-white/5 animate-pulse rounded-lg" /> : stats.activeTickets.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="card-glass p-8 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-xl">
                                    <FaShoppingBag />
                                </div>
                                <div className="flex items-center gap-1 text-green-500 text-xs font-black">
                                    <FaStar /> مميز
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 font-bold text-xs uppercase mb-1">إجمالي المنتجات</h3>
                                <div className="text-3xl font-black text-white">
                                    {loading ? <div className="h-9 w-32 bg-white/5 animate-pulse rounded-lg" /> : stats.totalProducts.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 card-glass p-8">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">نمو المبيعات</h3>
                                    <p className="text-xs text-gray-500">معدل البيع اليومي خلال آخر 30 يوم</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20 italic">LIVE DATA</div>
                                </div>
                            </div>
                            <SalesChart data={salesData.length > 0 ? salesData : mockSalesData} />
                        </div>

                        <div className="lg:col-span-4 card-glass p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-8">نشاط المستخدمين</h3>
                            <div className="flex-grow space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#38bdf8]" />
                                        <span className="text-sm text-gray-400 font-bold">زائر جديد</span>
                                    </div>
                                    <span className="text-white font-black">4,230</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-sky-500" />
                                        <span className="text-sm text-gray-400 font-bold">عملية شراء</span>
                                    </div>
                                    <span className="text-white font-black">1,840</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-sm text-gray-400 font-bold">اشتراك نشرة</span>
                                    </div>
                                    <span className="text-white font-black">890</span>
                                </div>
                            </div>
                            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <h4 className="text-xs font-black text-gray-500 uppercase mb-4 tracking-widest leading-loose">معدل التحويل (Conversion Rate)</h4>
                                <div className="text-5xl font-black text-gradient">24.5%</div>
                            </div>
                        </div>
                    </div>

                    <div className="h-20" /> {/* Spacer */}
                </motion.div>
            </main>
        </div>
    )
}
