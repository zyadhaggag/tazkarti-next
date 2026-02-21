'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle, FaSearch, FaCreditCard, FaExchangeAlt } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/layouts/AdminSidebar'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils/format'
import { fadeInUp } from '@/lib/utils/animations'

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        setLoading(true)
        const { data } = await supabase.from('payments').select('*, profiles(full_name, email)').order('created_at', { ascending: false })
        if (data) setPayments(data)
        setLoading(false)
    }

    const filteredPayments = payments.filter(p =>
        p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">سجلات <span className="text-primary">المدفوعات</span></h1>
                        <p className="text-gray-500">مراقبة العمليات المالية، المبالغ المحصلة، وحالة كل دفع مؤكد.</p>
                    </div>

                    <div className="card-glass p-6">
                        <div className="relative mb-8">
                            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 glass border-white/10 rounded-xl pr-12 pl-6 focus:border-primary outline-none transition-all"
                                placeholder="بحث برقم العملية أو اسم المشتري..."
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="border-b border-white/5 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                                        <th className="px-6 py-4">رقم العملية</th>
                                        <th className="px-6 py-4">المشتري</th>
                                        <th className="px-6 py-4">المبلغ</th>
                                        <th className="px-6 py-4">الحالة</th>
                                        <th className="px-6 py-4">التاريخ</th>
                                        <th className="px-6 py-4">الوسيلة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-20 text-center"><Spinner /></td></tr>
                                    ) : filteredPayments.length > 0 ? filteredPayments.map((p) => (
                                        <tr key={p.id} className="group hover:bg-white/5 transition-all text-white text-sm">
                                            <td className="px-6 py-5 font-bold text-gray-500 text-[10px] uppercase truncate max-w-[120px]">#{p.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold">{p.profiles?.full_name || 'زائر'}</div>
                                                <div className="text-[10px] text-gray-500">{p.profiles?.email || '-'}</div>
                                            </td>
                                            <td className="px-6 py-5 font-black text-primary">
                                                {formatCurrency(p.amount)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${p.status === 'succeeded' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                    {p.status === 'succeeded' ? <FaCheckCircle /> : <FaClock />}
                                                    {p.status === 'succeeded' ? 'ناجحة' : 'معلقة'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-400 text-xs font-bold">
                                                {new Date(p.created_at).toLocaleString('ar-SA')}
                                            </td>
                                            <td className="px-6 py-5 text-gray-500">
                                                <div className="flex items-center gap-2"><FaCreditCard className="text-[10px]" /> Stripe</div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="py-20 text-center opacity-50">لا توجد عمليات دفع للتعامل معها.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
