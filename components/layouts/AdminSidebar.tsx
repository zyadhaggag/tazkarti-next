'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaChartPie, FaTicketAlt, FaShoppingBag, FaUsers, FaBriefcase, FaMoneyBillWave, FaArrowRight, FaCog, FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { slideInRight } from '@/lib/utils/animations'

export default function AdminSidebar() {
    const pathname = usePathname()

    const menuItems = [
        { name: 'الإحصائيات', href: '/admin', icon: FaChartPie },
        { name: 'التذاكر', href: '/admin/tickets', icon: FaTicketAlt },
        { name: 'الإشعارات', href: '/admin/notifications', icon: FaBell },
        { name: 'الدعم الفني', href: '/admin/support', icon: FaBriefcase },
        { name: 'المنتجات', href: '/admin/products', icon: FaShoppingBag },
        { name: 'المستخدمين', href: '/admin/users', icon: FaUsers },
        { name: 'طلبات التوظيف', href: '/admin/applications', icon: FaBriefcase },
        { name: 'المدفوعات', href: '/admin/payments', icon: FaMoneyBillWave },
    ]

    return (
        <motion.aside
            variants={slideInRight}
            initial="initial"
            animate="animate"
            className="w-full lg:w-72 lg:h-screen sticky lg:fixed top-0 right-0 bg-dark z-50 border-b lg:border-b-0 lg:border-l border-white/5 flex flex-col p-4 lg:p-6"
        >
            <div className="flex items-center gap-4 lg:mb-12 mb-4 lg:pt-4">
                <div className="hidden lg:block h-6 w-px bg-white/10" />
                <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded uppercase">Admin Panel</span>
            </div>

            <nav className="flex lg:flex-col gap-2 lg:gap-0 lg:space-y-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex-shrink-0 flex items-center justify-between p-3 lg:p-4 rounded-xl transition-all ${isActive ? 'bg-primary-gradient text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3 lg:gap-4">
                                <item.icon className={`text-xl ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary transition-colors'}`} />
                                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                            </div>
                            {isActive && <motion.div layoutId="activeDot" className="hidden lg:block w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="hidden lg:block mt-auto pt-8 border-t border-white/5 space-y-2">
                <Link href="/settings" className="flex items-center gap-4 p-4 text-gray-500 hover:text-white transition-all">
                    <FaCog className="text-xl" />
                    <span className="font-bold text-sm">الاعدادات</span>
                </Link>
                <Link href="/" className="flex items-center gap-4 p-4 text-gray-500 hover:text-white transition-all text-red-400">
                    <FaArrowRight className="text-xl" />
                    <span className="font-bold text-sm">عودة للموقع</span>
                </Link>
            </div>

            <div className="flex lg:hidden items-center gap-2 mt-2 pt-2 border-t border-white/5">
                <Link href="/settings" className="flex-1 flex justify-center items-center gap-2 p-2 rounded-xl bg-white/5 text-gray-400 text-sm font-bold">
                    <FaCog /> الاعدادات
                </Link>
                <Link href="/" className="flex-1 flex justify-center items-center gap-2 p-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold">
                    <FaArrowRight /> للموقع
                </Link>
            </div>
        </motion.aside>
    )
}
