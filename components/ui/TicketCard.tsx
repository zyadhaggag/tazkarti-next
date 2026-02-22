'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaChair, FaShoppingCart } from 'react-icons/fa'
import { Ticket } from '@/lib/types/app.types'
import { formatCurrency } from '@/lib/utils/format'
import { fadeInUp, hoverScale } from '@/lib/utils/animations'
import Button from './Button'

import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface TicketCardProps {
    ticket: Ticket
    onBuy?: (id: string) => void
}

export default function TicketCard({ ticket, onBuy }: TicketCardProps) {
    const supabase = createClient()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleBuy = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            toast.error('يجب تسجيل الدخول قبل شراء التذاكر.', { icon: '🔒' })
            window.dispatchEvent(new Event('openAuthModal'))
            return
        }

        setIsProcessing(true)
        // Artificial delay for UX feedback
        await new Promise(resolve => setTimeout(resolve, 800))
        onBuy?.(ticket.id)
        setIsProcessing(false)
    }

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.02, rotateX: 5, rotateY: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="card-glass group flex flex-col perspective-1000 h-full"
        >
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                <Image
                    src="/assets/images/ticket-placeholder.jpg"
                    alt={ticket.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10 -mt-10">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{ticket.name}</h3>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <FaChair className="text-primary" />
                    <span>{ticket.seat_location}</span>
                </div>

                {ticket.description && (
                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">
                        {ticket.description}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-2xl font-bold text-white">
                        {formatCurrency(ticket.price)}
                    </div>
                    <Button onClick={handleBuy} isLoading={isProcessing} className="px-4 py-2 text-sm z-10 relative">
                        <FaShoppingCart /> شراء
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
