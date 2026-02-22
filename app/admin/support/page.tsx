"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    FaHeadset,
    FaPaperPlane,
    FaRobot,
    FaSearch,
    FaCheckCircle,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { ChatMessage, Profile } from "@/lib/types/app.types";
import AdminSidebar from "@/components/layouts/AdminSidebar";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { formatRelativeTime } from "@/lib/utils/format";
import ClientTitle from "@/components/ui/ClientTitle";

export default function AdminSupportPage() {
    const [users, setUsers] = useState<{ id: string; email: string; name: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const supabase = createClient();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUsersWithMessages();

        const channel = supabase
            .channel("admin_chat_messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                },
                (payload: { new: ChatMessage }) => {
                    if (payload.new.user_id === selectedUser) {
                        setMessages((prev) => [...prev, payload.new as ChatMessage]);
                    } else if (!payload.new.is_admin) {
                        toast.success("رسالة دعم فني جديدة!");
                        fetchUsersWithMessages(); // Refresh the list
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchUsersWithMessages = async () => {
        setLoading(true);

        // Get unique user IDs from chat_messages
        const { data: chatData } = await supabase
            .from("chat_messages")
            .select("user_id")
            .order("created_at", { ascending: false });

        if (chatData) {
            const uniqueUserIds = Array.from(new Set(chatData.map((m) => m.user_id)));

            // Fetch profile details for these users
            if (uniqueUserIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from("profiles")
                    .select("id, email, full_name")
                    .in("id", uniqueUserIds);

                if (profilesData) {
                    const mappedUsers = uniqueUserIds.map((uid) => {
                        const p = profilesData.find(p => p.id === uid);
                        return {
                            id: uid,
                            email: p?.email || "Unknown",
                            name: p?.full_name || "المستخدم"
                        }
                    });
                    setUsers(mappedUsers);
                }
            }
        }
        setLoading(false);
    };

    const fetchMessages = async (userId: string) => {
        setSelectedUser(userId);
        const { data } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (data) setMessages(data);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedUser) return;

        setSending(true);
        const newMessage = {
            user_id: selectedUser,
            message: inputValue,
            is_admin: true,
        };

        const { error } = await supabase.from("chat_messages").insert([newMessage]);

        if (error) {
            toast.error("فشل إرسال الرسالة");
        } else {
            setInputValue("");
        }
        setSending(false);
    };

    const filteredUsers = users.filter((u) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <ClientTitle title="إدارة الدعم الفني" />
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12 flex flex-col h-screen">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FaHeadset className="text-primary" /> الدعم الفني
                    </h1>
                    <p className="text-gray-500 mt-2">تواصل مع العملاء وحل مشاكلهم مباشرة</p>
                </div>

                <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
                    {/* Users List Sidebar */}
                    <div className="w-full md:w-1/3 card-glass flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن مستخدم..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-2 custom-scrollbar space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Spinner size="md" />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center text-gray-500 p-8 text-sm">لا يوجد محادثات حالياً</div>
                            ) : (
                                filteredUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => fetchMessages(user.id)}
                                        className={`w-full text-right p-4 rounded-xl transition-all flex items-center gap-3 ${selectedUser === user.id ? "bg-primary/20 border-primary shadow-lg border" : "bg-white/5 border-transparent border hover:bg-white/10"}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                                            <img src="/assets/images/1.svg" alt="U" className="w-full h-full object-cover opacity-80" />
                                        </div>
                                        <div className="flex-grow truncate">
                                            <div className="font-bold text-white text-sm truncate">{user.name}</div>
                                            <div className="text-xs text-gray-400 truncate mt-1">{user.email}</div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="w-full md:w-2/3 card-glass flex flex-col overflow-hidden relative">
                        {!selectedUser ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                <FaHeadset className="text-6xl mb-4 opacity-50" />
                                <p className="text-lg">اختر محادثة للبدء في الرد</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl font-bold text-white">
                                            {users.find(u => u.id === selectedUser)?.name}
                                        </div>
                                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                                            <FaCheckCircle /> مستخدم موثق
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={msg.id || i}
                                            className={`flex ${msg.is_admin ? "justify-end" : "justify-start"} gap-3 items-end`}
                                        >
                                            {msg.is_admin && (
                                                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mb-6 shrink-0">
                                                    <FaRobot />
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[80%] md:max-w-[70%] p-4 rounded-3xl relative ${msg.is_admin ? "bg-primary-gradient text-white rounded-bl-none shadow-lg" : "bg-white/5 border border-white/10 text-white rounded-br-none"}`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                                <span className={`text-[9px] opacity-50 mt-2 block ${msg.is_admin ? "text-right" : "text-left"}`}>
                                                    {formatRelativeTime(msg.created_at)}
                                                </span>
                                            </div>
                                            {!msg.is_admin && (
                                                <div className="w-8 h-8 rounded-full bg-dark/50 border border-white/10 flex items-center justify-center text-gray-500 mb-6 shrink-0 overflow-hidden">
                                                    <img src="/assets/images/1.svg" alt="U" className="opacity-80" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/10">
                                    <div className="relative flex gap-3">
                                        <input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="اكتب ردك هنا..."
                                            className="flex-grow h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm outline-none focus:border-primary transition-all pr-12"
                                            disabled={sending}
                                        />
                                        <Button
                                            type="submit"
                                            isLoading={sending}
                                            className="h-14 w-14 shrink-0 !rounded-2xl p-0 flex items-center justify-center"
                                        >
                                            <FaPaperPlane className="transform -rotate-45" />
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
