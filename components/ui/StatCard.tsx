'use client'

import { IconType } from 'react-icons'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { fadeInUp, hoverScale } from '@/lib/utils/animations'

interface StatCardProps {
    icon: IconType
    value: number
    label: string
    suffix?: string
}

export default function StatCard({ icon: Icon, value, label, suffix = '+' }: StatCardProps) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

    return (
        <motion.div
            ref={ref}
            variants={fadeInUp}
            whileHover={hoverScale}
            className="card-glass p-8 flex flex-col items-center text-center group"
        >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon />
            </div>
            <div className="text-4xl font-black text-white mb-2">
                {inView ? <CountUp end={value} duration={2.5} suffix={suffix} /> : '0'}
            </div>
            <div className="text-gray-400 font-bold uppercase tracking-wider text-sm">{label}</div>
        </motion.div>
    )
}
