'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaTrash, FaEdit, FaShoppingBag, FaSearch, FaTag, FaImage } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types/app.types'
import AdminSidebar from '@/components/layouts/AdminSidebar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/lib/utils/format'

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data } = await supabase.from('store_items').select('*').order('created_at', { ascending: false })
        if (data) setProducts(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
        const { error } = await supabase.from('store_items').delete().eq('id', id)
        if (error) {
            toast.error('فشل عملية الحذف')
        } else {
            toast.success('تم حذف المنتج بنجاح')
            fetchProducts()
        }
    }

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const features = (formData.get('features') as string).split(',').map(f => f.trim()).filter(Boolean)

        const data = {
            name: formData.get('name') as string,
            price: Number(formData.get('price')),
            image_url: formData.get('image') as string,
            description: formData.get('description') as string,
            features: features
        }

        const { error } = await supabase.from('store_items').insert([data])
        if (error) {
            toast.error('حدث خطأ أثناء الإضافة')
        } else {
            toast.success('تم إضافة المنتج بنجاح!')
            setIsAddModalOpen(false)
            fetchProducts()
        }
        setSubmitting(false)
    }

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2">إدارة <span className="text-primary">المنتجات</span></h1>
                            <p className="text-gray-500">تحكم في الكتالوج، أضف السلع الجديدة، وعدل الأسعار.</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)} className="h-12 px-8">
                            <FaPlus /> إضافة منتج جديد
                        </Button>
                    </div>

                    <div className="card-glass p-6">
                        <div className="relative mb-8">
                            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 glass border-white/10 rounded-xl pr-12 pl-6 focus:border-primary outline-none transition-all"
                                placeholder="ابحث عن منتج بالاسم..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full py-40 flex justify-center"><Spinner /></div>
                            ) : filteredProducts.map((product) => (
                                <div key={product.id} className="card-glass p-4 group">
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/5">
                                        <img src={product.image_url || ''} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt="" />
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><FaTrash className="text-xs" /></button>
                                            <button className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"><FaEdit className="text-xs" /></button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                                    <div className="text-xl font-black text-primary mb-4">{formatCurrency(product.price)}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {product.features?.slice(0, 2).map((f: string, i: number) => (
                                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-500 border border-white/5">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة منتج جديد" maxWidth="max-w-xl">
                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">اسم المنتج</label>
                        <input name="name" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">السعر (SAR)</label>
                        <input name="price" type="number" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2"><FaImage /> رابط الصورة</label>
                        <input name="image" required className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2"><FaTag /> المميزات (افصل بفاصلة ,)</label>
                        <input name="features" required placeholder="أصلي 100%, جودة عالية, شحن سريع" className="w-full h-12 glass border-white/10 rounded-xl px-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">الوصف</label>
                        <textarea name="description" rows={3} className="w-full glass border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all" />
                    </div>
                    <Button type="submit" isLoading={submitting} className="w-full h-14 mt-4 text-lg">إطلاق المنتج</Button>
                </form>
            </Modal>
        </div>
    )
}
