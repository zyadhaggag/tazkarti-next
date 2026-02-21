'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBriefcase, FaEnvelope, FaPhone, FaCheck, FaTimes, FaClock, FaEye } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/layouts/AdminSidebar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { toast } from 'react-hot-toast'
import { fadeInUp } from '@/lib/utils/animations'

export default function AdminApplicationsPage() {
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchApps()
    }, [])

    const fetchApps = async () => {
        setLoading(true)
        const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false })
        if (data) setApps(data)
        setLoading(false)
    }

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('job_applications').update({ status }).eq('id', id)
        if (error) {
            toast.error('فشل تحديث الحالة')
        } else {
            toast.success(`تم ${status === 'accepted' ? 'قبول' : 'رفض'} الطلب`)
            setSelectedApp(null)
            fetchApps()
        }
    }

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">طلبات <span className="text-primary">التوظيف</span></h1>
                        <p className="text-gray-500">راجع طلبات الانضمام لفريق تذكرتي واتخذ القرار المناسب.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full py-40 flex justify-center"><Spinner /></div>
                        ) : apps.length > 0 ? apps.map((app) => (
                            <motion.div
                                key={app.id}
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                className={`card-glass p-6 group border-l-4 ${app.status === 'accepted' ? 'border-green-500' : app.status === 'rejected' ? 'border-red-500' : 'border-primary'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary text-xl">
                                        <FaBriefcase />
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${app.status === 'accepted' ? 'bg-green-500/10 text-green-500' : app.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                        {app.status === 'pending' ? 'قيد المراجعة' : app.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{app.full_name}</h3>
                                <p className="text-primary text-xs font-bold mb-4">{app.position === 'marketer' ? 'مسوق للموقع' : 'مشرف أدمن'}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500"><FaEnvelope /> {app.email}</div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500"><FaPhone /> {app.phone}</div>
                                </div>

                                <Button variant="outline" className="w-full text-xs h-10" onClick={() => setSelectedApp(app)}>
                                    <FaEye /> عرض التفاصيل
                                </Button>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center opacity-50">لا توجد طلبات توظيف حالياً.</div>
                        )}
                    </div>
                </div>
            </main>

            <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="تفاصيل طلب التوظيف" maxWidth="max-w-2xl">
                {selectedApp && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-500 uppercase mb-2">الاسم والبيانات</h4>
                                <p className="text-white font-bold">{selectedApp.full_name}</p>
                                <p className="text-gray-400 text-sm">{selectedApp.email}</p>
                                <p className="text-gray-400 text-sm">{selectedApp.phone}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-500 uppercase mb-2">الوظيفة والخبرة</h4>
                                <p className="text-primary font-bold">{selectedApp.position}</p>
                                <p className="text-gray-400 text-sm">{selectedApp.experience}</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">لماذا يريد الانضمام؟</h4>
                            <p className="text-white text-sm leading-relaxed">{selectedApp.reason}</p>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => updateStatus(selectedApp.id, 'accepted')} className="flex-grow !bg-green-600 hover:!bg-green-700 h-14">
                                <FaCheck /> قبول الطلب
                            </Button>
                            <Button onClick={() => updateStatus(selectedApp.id, 'rejected')} variant="danger" className="flex-grow h-14">
                                <FaTimes /> رفض الطلب
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
