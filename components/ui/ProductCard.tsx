'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaHeart, FaShoppingCart, FaCheckCircle } from 'react-icons/fa'
import { Product } from '@/lib/types/app.types'
import { formatCurrency } from '@/lib/utils/format'
import { fadeInUp, hoverScale } from '@/lib/utils/animations'
import Button from './Button'

import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
    product: Product
    isLiked?: boolean
    onLike?: (id: string) => void
    onBuy?: (id: string) => void
    variant?: 'full' | 'mini'
}

export default function ProductCard({ product, isLiked, onLike, onBuy, variant = 'full' }: ProductCardProps) {
    const supabase = createClient()
    const [actionLoading, setActionLoading] = useState<'buy' | 'like' | null>(null)

    const handleAction = async (action: 'buy' | 'like') => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            toast.error(`يجب تسجيل الدخول قبل ${action === 'buy' ? 'الشراء' : 'إضافة المنتجات للمفضلة'}.`, { icon: '🔒' })
            window.dispatchEvent(new Event('openAuthModal'))
            return
        }

        setActionLoading(action)
        // Artificial delay for UX
        await new Promise(resolve => setTimeout(resolve, 800))
        if (action === 'buy') onBuy?.(product.id)
        if (action === 'like') onLike?.(product.id)
        setActionLoading(null)
    }

    if (variant === 'mini') {
        return (
            <motion.div
                variants={fadeInUp}
                whileHover={hoverScale}
                className="card-glass p-4 flex gap-4 items-center group"
            >
                <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                        src="/assets/images/prodact.png"
                        className="object-cover rounded-xl"
                        alt={product.name}
                        fill
                    />
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                    <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
                    <Button onClick={() => handleAction('buy')} isLoading={actionLoading === 'buy'} variant="outline" className="mt-2 py-1 px-3 text-[10px] w-full h-8 z-10 relative">
                        شراء الحين
                    </Button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.02, rotateX: 5, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="card-glass group flex flex-col perspective-1000"
        >
            <div className="relative aspect-square overflow-hidden bg-white/5 rounded-t-2xl">
                <Image
                    src="/assets/images/prodact.png"
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-125 p-4"
                />
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10 -mt-8">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="text-2xl font-black text-primary mb-4">{formatCurrency(product.price)}</div>

                {product.features && product.features.length > 0 && (
                    <ul className="mb-6 space-y-2">
                        {product.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                                <FaCheckCircle className="text-primary text-xs" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <Button onClick={() => handleAction('buy')} isLoading={actionLoading === 'buy'} className="w-full mt-auto py-4 z-10 relative">
                    <FaShoppingCart /> اضف للسلة
                </Button>
            </div>
        </motion.div>
    )
}
