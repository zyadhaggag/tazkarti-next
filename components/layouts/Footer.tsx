import Link from 'next/link'
import { FaXTwitter, FaTiktok, FaYoutube } from 'react-icons/fa6'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-dark pt-20 pb-10 overflow-hidden border-t border-white/5">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="h-12" /> {/* Spacer instead of logo */}
                        <p className="max-w-xs text-center md:text-right text-gray-400 text-sm leading-relaxed">
                            منصتك الأولى للحجوزات والخدمات الفخمة. نضبطك بكل اللي تحتاجه بأفضل جودة وسرعة.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link>
                        <Link href="/store" className="text-gray-400 hover:text-white transition-colors">المتجر</Link>
                        <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">الإعدادات</Link>
                        <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">فزعة (الدعم الفني)</Link>
                        <button onClick={() => (window as any).showJobModal?.()} className="text-gray-400 hover:text-primary transition-colors">خلك معنا (توظيف)</button>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-primary transition-all hover:-translate-y-1">
                            <FaXTwitter />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-primary transition-all hover:-translate-y-1">
                            <FaTiktok />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-primary transition-all hover:-translate-y-1">
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
                    <p>© {currentYear} تذكرتي. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
