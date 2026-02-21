import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.15, ease: "easeIn" } },
}

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const slideInRight: Variants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: { x: 50, opacity: 0, transition: { duration: 0.2 } },
}

export const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 },
}

export const tapScale = {
    scale: 0.95,
}
