'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { fadeIn, fadeInUp } from '@/lib/utils/animations'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    maxWidth?: string
}

export default function Modal({ isOpen, onClose, children, title, maxWidth = 'max-w-md' }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-dark/80 backdrop-blur-md"
                    />

                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`relative w-full ${maxWidth} max-h-[90vh] glass border border-white/10 rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar`}
                    >
                        <div className={title ? "p-6" : "relative"}>
                            {title ? (
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">{title}</h3>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                                    >
                                        <FaTimes className="text-gray-400" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-[60] w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <FaTimes className="text-white" />
                                </button>
                            )}
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
