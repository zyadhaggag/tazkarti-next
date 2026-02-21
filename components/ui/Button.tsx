import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { tapScale } from '@/lib/utils/animations'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode
    variant?: 'primary' | 'outline' | 'ghost' | 'danger'
    isLoading?: boolean
    className?: string
}

export default function Button({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'btn-primary',
        outline: 'btn-outline',
        ghost: 'hover:bg-white/5 text-gray-400 hover:text-white transition-all px-4 py-2 rounded-lg',
        danger: 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-lg transition-all',
    }

    return (
        <motion.button
            whileTap={tapScale}
            disabled={isLoading || props.disabled}
            className={`${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري...</span>
                </div>
            ) : children}
        </motion.button>
    )
}
