'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaFilter, FaShoppingBag, FaHeart } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types/app.types'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import ProductCard from '@/components/ui/ProductCard'
import Spinner from '@/components/ui/Spinner'
import { fadeInUp, staggerChildren } from '@/lib/utils/animations'
import { toast } from 'react-hot-toast'

export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [userLikes, setUserLikes] = useState<Set<string>>(new Set())

    const supabase = createClient()

    useEffect(() => {
        fetchProducts()
        fetchUserLikes()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('store_items')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error) setProducts(data || [])
        setLoading(false)
    }

    const fetchUserLikes = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase.from('user_likes').select('item_id').eq('user_id', user.id)
            if (data) setUserLikes(new Set(data.map(l => l.item_id)))
        }
    }

    const handleLike = async (productId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            toast.error('يجب تسجيل الدخول للإعجاب بالمنتجات')
            return
        }

        if (userLikes.has(productId)) {
            await supabase.from('user_likes').delete().eq('user_id', user.id).eq('item_id', productId)
            setUserLikes(prev => {
                const next = new Set(prev)
                next.delete(productId)
                return next
            })
            toast.success('تم إزالة الإعجاب')
        } else {
            await supabase.from('user_likes').insert([{ user_id: user.id, item_id: productId }])
            setUserLikes(prev => new Set([...Array.from(prev), productId]))
            toast.success('تم إضافة الإعجاب')
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <main className="min-h-screen bg-dark">
            <Header />

            {/* Page Header */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-50 -skew-y-3 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">متجر <span className="text-primary italic">تذكرتي</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
                            اكتشف أحدث المنتجات الرياضية الحصرية والملابس والأدوات التي لن تجدها في أي مكان آخر.
                        </p>
                    </motion.div>

                    {/* Search Input */}
                    <div className="max-w-4xl mx-auto flex gap-4 items-center mb-12">
                        <div className="relative w-full">
                            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ابحث عن منتج..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 glass border border-white/10 rounded-2xl pr-12 pl-6 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="py-40 flex justify-center"><Spinner size="lg" /></div>
                    ) : filteredProducts.length > 0 ? (
                        <motion.div
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        isLiked={userLikes.has(product.id)}
                                        onLike={handleLike}
                                        onBuy={(id) => window.location.href = `/payment?item=${id}&type=product`}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-40 card-glass max-w-2xl mx-auto">
                            <FaShoppingBag className="text-7xl text-gray-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
                            <p className="text-gray-400">حاول البحث عن كلمات أخرى أو تغيير الفلتر.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
