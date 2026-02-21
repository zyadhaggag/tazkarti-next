'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaEdit, FaTicketAlt, FaChair, FaSearch } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import { Ticket } from '@/lib/types/app.types'
import AdminSidebar from '@/components/layouts/AdminSidebar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/lib/utils/format'

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setLoading(true)
        const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
        if (data) setTickets(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه التذكرة؟')) return
        const { error } = await supabase.from('tickets').delete().eq('id', id)
        if (error) {
            toast.error('فشل عملية الحذف')
        } else {
            toast.success('تم حذف التذكرة بنجاح')
            fetchTickets()
        }
    }

    const handleAddTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            seat_location: formData.get('seat') as string,
            price: Number(formData.get('price')),
            image_url: formData.get('image') as string,
            description: formData.get('description') as string,
        }

        const { error } = await supabase.from('tickets').insert([data])
        if (error) {
            toast.error('حدث خطأ أثناء الإضافة')
        } else {
            toast.success('تم إضافة التذكرة بنجاح!')
            setIsAddModalOpen(false)
            fetchTickets()
        }
        setSubmitting(false)
    }

    const filteredTickets = tickets.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2">إدارة <span className="text-primary">التذاكر</span></h1>
                            <p className="text-gray-500">أضف، عدل، أو احذف التذاكر المتاحة في الموقع.</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)} className="h-12 px-8">
                            <FaPlus /> إضافة تذكرة جديدة
                        </Button>
                    </div>

                    <div className="card-glass p-6">
                        <div className="relative mb-8">
                            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 glass border-white/10 rounded-xl pr-12 pl-6 focus:border-primary outline-none transition-all"
                                placeholder="ابحث عن تذكرة بالاسم..."
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-widest">
                                        <th className="px-6 py-4 font-black">التذكرة</th>
                                        <th className="px-6 py-4 font-black">الموقع</th>
                                        <th className="px-6 py-4 font-black">السعر</th>
                                        <th className="px-6 py-4 font-black">خيارات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={4} className="py-20 text-center"><Spinner /></td></tr>
                                    ) : filteredTickets.map((ticket) => (
                                        <tr key={ticket.id} className="group hover:bg-white/5 transition-all text-white font-bold">
                                            <td className="px-6 py-5 flex items-center gap-4">
                                                <img src={ticket.image_url || ''} className="w-12 h-12 rounded-lg object-cover bg-white/5" alt="" />
                                                <span>{ticket.name}</span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-400 font-medium">
                                                <div className="flex items-center gap-2"><FaChair className="text-primary/50" /> {ticket.seat_location}</div>
                                            </td>
                                            <td className="px-6 py-5 text-primary text-lg">
                                                {formatCurrency(ticket.price)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex gap-2">
                                                    <button className="w-9 h-9 rounded-lg glass border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"><FaEdit /></button>
                                                    <button onClick={() => handleDelete(ticket.id)} className="w-9 h-9 rounded-lg glass border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة تذكرة جديدة" maxWidth="max-w-xl">
                <form onSubmit={handleAddTicket} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">اسم التذكرة / المباراة</label>
                        <input name="name" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase">موقع المقعد</label>
                            <input name="seat" placeholder="مثال: الواجهة" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase">السعر (SAR)</label>
                            <input name="price" type="number" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">رابط الصورة (URL)</label>
                        <input name="image" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">الوصف</label>
                        <textarea name="description" rows={3} className="w-full glass border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <Button type="submit" isLoading={submitting} className="w-full h-14 mt-4 text-lg">إضافة الآن</Button>
                </form>
            </Modal>
        </div>
    )
}
