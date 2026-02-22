"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaTicketAlt,
  FaStore,
  FaUserCheck,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteRight,
  FaGamepad,
  FaTrophy,
  FaArrowDown,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Ticket, Product } from "@/lib/types/app.types";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import TicketCard from "@/components/ui/TicketCard";
import ProductCard from "@/components/ui/ProductCard";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import LoginModal from "@/components/modals/LoginModal";
import JobModal from "@/components/modals/JobModal";
import { fadeInUp, staggerChildren } from "@/lib/utils/animations";

const testimonials = [
  {
    name: "سعود",
    text: "صراحة تعامل رهيب والتذاكر وصلت بسرعة",
    rating: 5,
    avatar: "/assets/images/1.svg",
  },
  {
    name: "عبدالله",
    text: "اسعارهم مره حلوة ومافي زي تذكرتي",
    rating: 5,
    avatar: "/assets/images/1.svg",
  },
  {
    name: "محمد",
    text: "والله اني منبهر بالخدمة, يستاهلون 5 نجوم",
    rating: 5,
    avatar: "/assets/images/1.svg",
  },
  {
    name: "فيصل",
    text: "اول مره اجرب وطلعت تجربة ممتازة",
    rating: 4,
    avatar: "/assets/images/1.svg",
  },
  {
    name: "نورة",
    text: "دعمهم سريع وردهم فوري, يعطيهم العافية",
    rating: 5,
    avatar: "/assets/images/1.svg",
  },
];

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const supabase = createClient();
  const router = useRouter();
  const { scrollY } = useScroll();

  useEffect(() => {
    // Expose Job Modal to global scope (legacy bridge for Footer)
    (window as any).showJobModal = () => setIsJobOpen(true);

    const fetchData = async () => {
      const { data: ticketsData } = await supabase
        .from("tickets")
        .select("*")
        .limit(6)
        .order("created_at", { ascending: false });
      const { data: productsData } = await supabase
        .from("store_items")
        .select("*")
        .limit(3)
        .order("created_at", { ascending: false });
      setTickets(ticketsData || []);
      setLatestProducts(productsData || []);
    };
    fetchData();

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-dark overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Luxurious Stadium Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/hero.png"
            alt="Hero"
            fill
            priority
            quality={100}
            className="object-cover opacity-70"
          />
          {/* Dynamic modern glowing orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-primary/20 blur-[80px] mix-blend-screen animate-blob pointer-events-none" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[80px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[100px] mix-blend-screen animate-blob animation-delay-4000 pointer-events-none" />

          {/* Modern subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/60 to-dark pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="container mx-auto px-6 relative z-10 text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border border-white/10 text-white/90 text-sm font-bold mb-10 shadow-2xl backdrop-blur-md"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            أطلق منصة للحجوزات والخدمات، مضمونة 100%
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 leading-snug drop-shadow-2xl tracking-tight"
          >
            تجربة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-500 inline-block drop-shadow-lg">رهيبة</span>
            <br />
            <span className="text-white/90">لحجوزاتك وخدماتك</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-gray-300 mb-10 leading-relaxed font-medium drop-shadow-lg"
          >
            نضبطك بأفضل الفعاليات والخدمات، بتجربة سهلة وسريعة ومضمونة من الآخر.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-5 w-full md:w-auto px-4"
          >
            <a href="#tickets" className="btn-primary w-full md:w-auto">
              <FaTicketAlt /> التذاكر المتوفرة
            </a>
            <a href="/store" className="btn-outline w-full md:w-auto">
              <FaStore /> متجرنا
            </a>
          </motion.div>
        </motion.div>

        {/* Bouncing down arrow */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-2xl z-20"
        >
          <FaArrowDown />
        </motion.div>
      </section>

      <div className="relative z-20 bg-dark w-full shadow-[0_-20px_50px_rgba(0,0,0,0.8)] rounded-t-[3rem] pt-8">


        {/* Tickets Grid */}
        <section id="tickets" className="py-32 relative">
          <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-secondary/10 blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center justify-center text-center mb-20 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center perspective-1000"
              >
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight flex items-center justify-center gap-3">
                  التذاكر
                  <span className="text-primary italic">الحصرية</span>
                </h2>
                <p className="text-gray-400 max-w-xl text-lg leading-relaxed mt-2">
                  فعاليات مسكتة – اضبط وضعك واحجز مكانك الحين، كل شيء عندنا مضمون من الآخر.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Latest Products */}
        <section className="py-32 relative border-t border-white/5">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-20 perspective-1000"
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight flex items-center justify-center gap-3">
                أحدث <span className="text-primary italic">خدماتنا</span>
              </h2>
              <p className="text-gray-400 text-lg">
                مجموعة رهيبة من خدماتنا المتنوعة مثل تصميم المواقع والشعارات وغيرها.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {latestProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                className="px-12 py-4"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('showGlobalLoader', { detail: 'جاري التوجه إلى المتجر...' }));
                  router.push('/store');
                }}
              >
                ادخل للمتجر الكامل
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative z-20 overflow-hidden bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full" />

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard icon={FaTicketAlt} value={350} label="طلب مكتمل" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard icon={FaUserCheck} value={1200} label="عميل مستانس" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard icon={FaGamepad} value={85} label="خدمة حصرية" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials - Auto Scrolling Carousel */}
        <section className="py-32 relative overflow-hidden border-t border-white/5">
          <div className="absolute top-1/2 left-0 w-1/3 h-[400px] bg-primary/10 blur-[150px] -translate-y-1/2 pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight flex items-center justify-center gap-3 perspective-1000 origin-center"
            >
              وش يقولون <span className="text-primary italic">عنا؟</span>
            </motion.h2>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -top-10 -right-10 text-9xl text-white/5 pointer-events-none">
                <FaQuoteRight />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, rotateX: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateX: -90, scale: 0.8 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  className="card-glass p-12 text-center perspective-1000 origin-bottom"
                >
                  <div className="mb-8 flex justify-center">
                    <img
                      src={testimonials[activeTestimonial].avatar}
                      className="w-24 h-24 rounded-full border-4 border-primary/20 p-1"
                      alt={testimonials[activeTestimonial].name}
                    />
                  </div>
                  <p className="text-2xl md:text-3xl text-white italic mb-8 leading-relaxed font-medium">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  <div className="flex flex-col items-center">
                    <h4 className="text-xl font-bold text-primary">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < testimonials[activeTestimonial].rating
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-3 mt-12">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === activeTestimonial ? "bg-primary w-8" : "bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />

        <JobModal isOpen={isJobOpen} onClose={() => setIsJobOpen(false)} />
      </div>
    </main>
  );
}
