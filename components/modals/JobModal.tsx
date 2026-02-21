'use client'

import { useState } from 'react'
import { FaBriefcase, FaPaperPlane } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface JobModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function JobModal({ isOpen, onClose }: JobModalProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            full_name: formData.get('fullName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            position: formData.get('position') as string,
            reason: formData.get('reason') as string,
            experience: formData.get('experience') as string,
        }

        const { error } = await supabase.from('job_applications').insert([data])

        setLoading(false)
        if (error) {
            toast.error('حدث خطأ أثناء إرسال الطلب.')
        } else {
            toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.')
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="قدم معنا" maxWidth="max-w-2xl">
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                    <FaBriefcase className="text-3xl text-primary" />
                    <p className="text-sm text-gray-300">كن جزءاً من فريق "تذكرتي" وساهم في بناء مستقبل حجز التذاكر في المنطقة.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">الاسم الكامل</label>
                        <input name="fullName" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" placeholder="مثال: سعود العتيبي" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">البريد الإلكتروني</label>
                        <input name="email" type="email" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">رقم الجوال</label>
                        <input name="phone" type="tel" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" placeholder="05xxxxxxxx" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">الوظيفة المطلوبة</label>
                        <select name="position" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                            <option value="marketer">مسوق للموقع</option>
                            <option value="admin_supervisor">مشرف أدمن</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">لماذا تريد الانضمام إلينا؟</label>
                        <textarea name="reason" rows={3} required className="w-full glass border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all" placeholder="اكتب سبب رغبتك..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">خبراتك السابقة</label>
                        <textarea name="experience" rows={3} required className="w-full glass border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all" placeholder="خبراتك السابقة..." />
                    </div>

                    <Button type="submit" isLoading={loading} className="md:col-span-2 h-14 mt-4">
                        <FaPaperPlane /> أرسل الطلب
                    </Button>
                </form>
            </div>
        </Modal>
    )
}
