"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FaUser,
    FaShoppingBag,
    FaCog,
    FaHeadset,
    FaHistory,
    FaCheckCircle,
    FaCrown,
    FaChevronLeft,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types/app.types";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { fadeInUp, staggerChildren } from "@/lib/utils/animations";
import ClientTitle from "@/components/ui/ClientTitle";

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
    });
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = "/";
            return;
        }

        const [profileRes, paymentsRes] = await Promise.all([
            supabase.from("profiles").select("*").eq("id", user.id).single(),
            supabase.from("payments").select("amount").eq("user_id", user.id).eq("status", "completed"),
        ]);

        if (profileRes.data) {
            setProfile(profileRes.data);
        }

        if (paymentsRes.data) {
            const totalSpent = paymentsRes.data.reduce((acc, p) => acc + p.amount, 0);
            setStats({
                totalOrders: paymentsRes.data.length,
                totalSpent,
            });
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-dark">
            <ClientTitle title="الملف الشخصي" />
            <Header />

            <div className="pt-32 pb-20 container mx-auto px-6 max-w-6xl">
                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    animate="animate"
                    className="space-y-10"
                >
                    {/* Profile Header Card */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative overflow-hidden group card-glass p-8 md:p-12"
                    >
                        {/* Background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary/20 overflow-hidden shadow-2xl">
                                    <img
                                        src="/assets/images/2.svg"
                                        className="w-full h-full object-cover"
                                        alt="Avatar"
                                    />
                                </div>
                                {profile?.role === "admin" && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-2 rounded-full shadow-lg">
                                        <FaCrown />
                                    </div>
                                )}
                            </div>

                            <div className="text-center md:text-right flex-grow">
                                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                    <h1 className="text-4xl md:text-5xl font-black text-white">
                                        {profile?.full_name || "المستخدم"}
                                    </h1>
                                    <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full border border-primary/20 uppercase">
                                        {profile?.role === "admin" ? "مدير المنصة" : "عميل مميز"}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-lg mb-6">{profile?.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                                        <FaCheckCircle /> حساب مفعل
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                        عضو منذ {new Date(profile?.created_at || "").getFullYear()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                <Link href="/settings">
                                    <Button variant="outline" className="w-full justify-center gap-2">
                                        <FaCog /> الإعدادات
                                    </Button>
                                </Link>
                                <Link href="/chat">
                                    <Button variant="ghost" className="w-full justify-center gap-2 hover:bg-white/5">
                                        <FaHeadset /> الدعم الفني
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div variants={fadeInUp} className="card-glass p-8 group">
                            <div className="flex items-center gap-4 mb-4 text-primary">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                                    <FaShoppingBag />
                                </div>
                                <h3 className="font-bold text-gray-400">إجمالي الطلبات</h3>
                            </div>
                            <div className="text-4xl font-black text-white">{stats.totalOrders}</div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="card-glass p-8 group">
                            <div className="flex items-center gap-4 mb-4 text-emerald-400">
                                <div className="w-12 h-12 bg-emerald-400/10 rounded-2xl flex items-center justify-center text-2xl">
                                    <FaCrown />
                                </div>
                                <h3 className="font-bold text-gray-400">المبلغ المستثمر</h3>
                            </div>
                            <div className="text-4xl font-black text-white">{stats.totalSpent} ر.س</div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="card-glass p-8 group">
                            <div className="flex items-center gap-4 mb-4 text-sky-400">
                                <div className="w-12 h-12 bg-sky-400/10 rounded-2xl flex items-center justify-center text-2xl">
                                    <FaHistory />
                                </div>
                                <h3 className="font-bold text-gray-400">حالة النشاط</h3>
                            </div>
                            <div className="text-4xl font-black text-white">نشط الآن</div>
                        </motion.div>
                    </div>

                    {/* Activity Section */}
                    <motion.div variants={fadeInUp} className="card-glass p-8 md:p-12">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                <FaHistory className="text-primary" /> قائمة المهام وطلباتي
                            </h3>
                            <Link href="/orders" className="text-primary font-bold flex items-center gap-2 hover:underline">
                                عرض الكل <FaChevronLeft className="text-xs" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {stats.totalOrders > 0 ? (
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                            <FaCheckCircle />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">لديك {stats.totalOrders} عمليات شراء مكتملة</h4>
                                            <p className="text-xs text-gray-500 italic">تم تحديث البيانات للتو</p>
                                        </div>
                                    </div>
                                    <FaChevronLeft className="text-gray-600 group-hover:text-primary transition-colors" />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-6">لم تقم بأي عمليات شراء بعد.</p>
                                    <Link href="/store">
                                        <Button>ابدأ التسوق الآن</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
