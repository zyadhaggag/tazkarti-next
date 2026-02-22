"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FaShoppingBag,
    FaCalendarAlt,
    FaTag,
    FaCheckCircle,
    FaClock,
    FaArrowRight,
    FaSearch,
    FaTicketAlt,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { fadeInUp, staggerChildren } from "@/lib/utils/animations";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface Order {
    id: string;
    created_at: string;
    amount: number;
    status: string;
    item_id: string;
    items?: any; // To store joined data
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = "/";
            return;
        }

        // Fetch payments and try to get item details
        const { data: payments, error } = await supabase
            .from("payments")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (payments) {
            // For each payment, try to find the item in tickets or store_items
            const enrichedOrders = await Promise.all(
                payments.map(async (order) => {
                    // Check tickets first
                    const { data: ticket } = await supabase
                        .from("tickets")
                        .select("name, seat_location")
                        .eq("id", order.item_id)
                        .single();

                    if (ticket) return { ...order, items: { ...ticket, type: "ticket" } };

                    // Check store_items
                    const { data: product } = await supabase
                        .from("store_items")
                        .select("name")
                        .eq("id", order.item_id)
                        .single();

                    if (product) return { ...order, items: { ...product, type: "product" } };

                    return order;
                })
            );
            setOrders(enrichedOrders);
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
            <ClientTitle title="تاريخ الطلبات" />
            <Header />

            <div className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    animate="animate"
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <Link href="/profile" className="text-primary font-bold flex items-center gap-2 mb-4 hover:underline">
                                <FaArrowRight className="text-xs" /> العودة للملف الشخصي
                            </Link>
                            <h1 className="text-5xl font-black text-white">تاريخ الطلبات</h1>
                            <p className="text-gray-400 mt-2">تتبع جميع عمليات الشراء والذاكر الخاصة بك في مكان واحد</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl">
                                <FaShoppingBag />
                            </div>
                            <div>
                                <div className="text-white font-black text-lg">{orders.length}</div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">إجمالي الطلبات</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Orders List */}
                    <div className="space-y-6">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    variants={fadeInUp}
                                    className="card-glass overflow-hidden group hover:border-primary/30 transition-all"
                                >
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-3xl text-gray-500 group-hover:text-primary transition-colors">
                                            {order.items?.type === "ticket" ? <FaTicketAlt /> : <FaTag />}
                                        </div>

                                        <div className="flex-grow text-center md:text-right">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                                <h3 className="text-xl font-black text-white">
                                                    {order.items?.name || "منتج غير معروف"}
                                                </h3>
                                                {order.items?.seat_location && (
                                                    <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded">
                                                        {order.items.seat_location}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-gray-500">
                                                <span className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-primary/50" /> {formatDate(order.created_at)}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <FaShoppingBag className="text-primary/50" /> رقم الطلب: {order.id.slice(0, 8)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                                            <div className="text-2xl font-black text-white">{formatCurrency(order.amount)}</div>
                                            <div
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${order.status === "completed"
                                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                    : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                                    }`}
                                            >
                                                {order.status === "completed" ? (
                                                    <>
                                                        <FaCheckCircle className="text-[10px]" /> مكتمل
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaClock className="text-[10px]" /> قيد المعالجة
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div variants={fadeInUp} className="text-center py-32 card-glass">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-gray-600">
                                    <FaSearch />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2">لا توجد طلبات بعد</h2>
                                <p className="text-gray-500 mb-8">لم يتم العثور على أي عمليات شراء سابقة في حسابك.</p>
                                <Link
                                    href="/store"
                                    className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:bg-primary/90 transition-all inline-block"
                                >
                                    استعرض المتجر الآن
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
