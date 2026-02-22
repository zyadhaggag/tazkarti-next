'use client'

import { motion } from 'framer-motion'
import { FaCheckCircle, FaRocket, FaTicketAlt, FaShoppingBag, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import Button from '@/components/ui/Button'
import { fadeInUp } from '@/lib/utils/animations'
import ClientTitle from '@/components/ui/ClientTitle'

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-dark flex flex-col">
            <ClientTitle title="عملية مجزأة" />
            <Header />

            <div className="flex-grow flex items-center justify-center pt-32 pb-20 container mx-auto px-6">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="card-glass p-12 md:p-20 max-w-2xl w-full text-center relative overflow-hidden"
                >
                    {/* Animated Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full -mt-32 blur-3xl animate-pulse" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                        className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 text-5xl flex items-center justify-center mx-auto mb-10 border border-green-500/30"
                    >
                        <FaCheckCircle />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">مبروك! <br /><span className="text-gradient">تمت العملية بنجاح</span></h1>

                    <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                        تم استلام طلبك وتأكيد عملية الدفع. يمكنك الآن العثور على تذكرتك في حسابك أو تتبع حالة منتجك المشتراى. شكراً لثقتك في تذكرتي!
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/" className="flex-grow">
                            <Button className="w-full h-14 text-lg">
                                <FaArrowRight className="ml-2" /> العودة للرئيسية
                            </Button>
                        </Link>
                        <Link href="/settings" className="flex-grow">
                            <Button variant="outline" className="w-full h-14 text-lg">
                                حسابي الخاص
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="text-primary text-2xl mb-2 flex justify-center"><FaTicketAlt /></div>
                            <div className="text-white font-bold text-xs uppercase tracking-widest">تذكرة مضمونة</div>
                        </div>
                        <div className="text-center">
                            <div className="text-primary text-2xl mb-2 flex justify-center"><FaRocket /></div>
                            <div className="text-white font-bold text-xs uppercase tracking-widest">تأكيد فوري</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}
