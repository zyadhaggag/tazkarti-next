'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCreditCard, FaTicketAlt, FaShieldAlt, FaChevronLeft, FaPercentage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'
import { Ticket, Product } from '@/lib/types/app.types'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils/format'
import { fadeInUp } from '@/lib/utils/animations'
import { toast } from 'react-hot-toast'

export default function PaymentPage() {
    const searchParams = useSearchParams()
    const itemId = searchParams.get('item')
    const itemType = searchParams.get('type') || 'ticket'

    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [couponCode, setCouponCode] = useState('')
    const [couponData, setCouponData] = useState<any>(null)
    const [validatingCoupon, setValidatingCoupon] = useState(false)
    const [processing, setProcessing] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        if (!itemId) {
            toast.error('لم يتم تحديد المنتج')
            window.location.href = '/'
            return
        }
        fetchItem()
    }, [itemId])

    const fetchItem = async () => {
        setLoading(true)
        const table = itemType === 'ticket' ? 'tickets' : 'store_items'
        const { data } = await supabase.from(table).select('*').eq('id', itemId).single()
        if (data) setItem(data)
        setLoading(false)
    }

    const handleValidateCoupon = async () => {
        if (!couponCode.trim()) return
        setValidatingCoupon(true)
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, amount: item.price })
            })
            const data = await res.json()
            if (data.success) {
                setCouponData(data)
                toast.success(`تم تطبيق خصم بقيمة ${formatCurrency(data.discount)}`)
            } else {
                toast.error(data.message || 'الكوبون غير صحيح')
                setCouponData(null)
            }
        } catch {
            toast.error('خطأ في التحقق من الكوبون')
        }
        setValidatingCoupon(false)
    }

    const handlePayment = async () => {
        setProcessing(true)
        // Here we would call Stripe API
        // For now we simulate success
        setTimeout(() => {
            toast.success('تمت عملية الشراء بنجاح!')
            setProcessing(false)
            window.location.href = '/success'
        }, 2000)
    }

    const originalPrice = item?.price || 0
    const discount = couponData?.discount || 0
    const finalTotal = originalPrice - discount

    if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center"><Spinner size="lg" /></div>

    return (
        <main className="min-h-screen bg-dark">
            <Header />

            <div className="pt-32 pb-20 container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* Order Summary */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <FaTicketAlt className="text-primary" /> ملخص الطلب
                            </h2>

                            <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden glass border border-white/10 shrink-0">
                                    <img src={item.image_url || '/assets/images/ticket-placeholder.jpg'} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="flex-grow">
                                    <div className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded inline-block mb-2 uppercase">
                                        {itemType === 'ticket' ? 'تذكرة مباراة' : 'منتج رياضي'}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{item.description || 'لا يوجد وصف متاح'}</p>
                                    {itemType === 'ticket' && (
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                            <FaShieldAlt /> حجز مضمون ومؤكد
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <FaCreditCard className="text-primary" /> تفاصيل الدفع
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">الاسم على البطاقة</label>
                                        <input className="w-full h-14 glass border-white/10 rounded-2xl px-6 focus:border-primary outline-none transition-all" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">رقم البطاقة</label>
                                        <input className="w-full h-14 glass border-white/10 rounded-2xl px-6 focus:border-primary outline-none transition-all" placeholder="**** **** **** ****" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 text-gray-400 text-sm">
                                    <FaShieldAlt className="text-primary text-xl" />
                                    جميع عمليات الدفع مشفرة وآمنة تماماً ولا يتم تخزين بيانات بطاقتك لدينا.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Column */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <div className="card-glass p-8 border-primary/20">
                                <h3 className="text-xl font-bold text-white mb-6">الدفع والمراجعة</h3>

                                {/* Coupon Area */}
                                <div className="mb-8">
                                    <div className="flex gap-2 relative">
                                        <input
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className={`w-full h-12 glass border rounded-xl pr-10 pl-4 text-sm focus:border-primary outline-none transition-all ${couponData ? 'border-green-500/50' : 'border-white/10'}`}
                                            placeholder="عندك كود خصم؟"
                                            disabled={!!couponData}
                                        />
                                        <FaPercentage className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <Button
                                            onClick={handleValidateCoupon}
                                            variant={couponData ? 'ghost' : 'outline'}
                                            isLoading={validatingCoupon}
                                            disabled={!!couponData || !couponCode}
                                            className="h-12 px-6 shrink-0"
                                        >
                                            {couponData ? <FaCheckCircle className="text-green-500" /> : 'تطبيق'}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 text-sm">
                                    <div className="flex justify-between text-gray-400 font-bold">
                                        <span>السعر الأصلي</span>
                                        <span>{formatCurrency(originalPrice)}</span>
                                    </div>
                                    {couponData && (
                                        <div className="flex justify-between text-green-500 font-bold">
                                            <span>خصم الكوبون ({couponData.code})</span>
                                            <span>- {formatCurrency(discount)}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-white/10" />
                                    <div className="flex justify-between text-2xl font-black text-white">
                                        <span>الإجمالي</span>
                                        <span className="text-primary">{formatCurrency(finalTotal)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePayment}
                                    isLoading={processing}
                                    className="w-full h-16 text-xl rounded-2xl shadow-primary/30"
                                >
                                    تأكيد الدفع الحين
                                </Button>

                                <div className="mt-6 flex items-center justify-center gap-4">
                                    <img src="/assets/images/payment-methods.png" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" alt="Payment Methods" />
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex gap-4">
                                <FaExclamationTriangle className="text-yellow-500 text-xl shrink-0 mt-1" />
                                <p className="text-xs text-yellow-500/80 leading-relaxed font-bold">
                                    تنبيه: التذاكر والمنتجات غير قابلة للاسترجاع بعد عملية الشراء. تأكد من بياناتك وصحة اختيارك قبل التأكيد.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}
