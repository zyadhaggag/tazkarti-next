"use client";

import { useState, useEffect } from "react";
import { FaPaperPlane, FaUsers, FaBell } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types/app.types";
import AdminSidebar from "@/components/layouts/AdminSidebar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-hot-toast";

export default function AdminNotificationsPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [targetUser, setTargetUser] = useState("all");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        const { data } = await supabase
            .from("profiles")
            .select("id, full_name, email, role")
            .order("created_at", { ascending: false });
        if (data) setUsers(data);
        setLoadingUsers(false);
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error("يرجى تعبئة عنوان الإشعار ومحتواه");
            return;
        }

        setIsSending(true);

        let notificationsToInsert = [];

        if (targetUser === "all") {
            notificationsToInsert = users.map((u) => ({
                user_id: u.id,
                type: "admin",
                title,
                message,
                is_read: false,
            }));
        } else {
            notificationsToInsert = [
                {
                    user_id: targetUser,
                    type: "admin",
                    title,
                    message,
                    is_read: false,
                },
            ];
        }

        const { error } = await supabase
            .from("notifications")
            .insert(notificationsToInsert);

        if (error) {
            toast.error("حدث خطأ أثناء إرسال الإشعار");
            console.error(error);
        } else {
            toast.success(
                targetUser === "all"
                    ? "تم إرسال الإشعار لجميع المستخدمين بنجاح"
                    : "تم إرسال الإشعار للمستخدم بنجاح"
            );
            setTitle("");
            setMessage("");
        }

        setIsSending(false);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
            <AdminSidebar />

            <main className="flex-grow lg:mr-72 p-6 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                            <FaBell className="text-primary" /> إرسال <span className="text-primary">إشعارات</span>
                        </h1>
                        <p className="text-gray-500">
                            قم بإرسال إشعارات فورية وتنبيهات مباشرة لتظهر في حسابات المستخدمين.
                        </p>
                    </div>

                    <div className="card-glass p-8 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                        <form onSubmit={handleSendNotification} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">المستلم</label>
                                <div className="relative">
                                    <FaUsers className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <select
                                        value={targetUser}
                                        onChange={(e) => setTargetUser(e.target.value)}
                                        className="w-full h-14 glass text-white border-white/10 rounded-xl pr-12 pl-4 focus:border-primary outline-none transition-all appearance-none cursor-pointer leading-[1.2]"
                                        disabled={loadingUsers}
                                    >
                                        <option value="all" className="bg-dark text-white p-2">جميع المستخدمين (إشعار عام)</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id} className="bg-dark text-white p-2">
                                                {u.full_name || "بدون اسم"} - ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">عنوان الإشعار</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="مثال: مبروك لقد ربحت معنا!"
                                    className="w-full h-14 glass border-white/10 rounded-xl px-6 focus:border-primary outline-none transition-all text-white"
                                    maxLength={100}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">محتوى الإشعار وتفاصيله</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="اكتب رسالتك هنا..."
                                    className="w-full h-40 glass border-white/10 rounded-xl p-6 focus:border-primary outline-none transition-all resize-none text-white"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSending || loadingUsers}
                                    className="h-14 px-8 rounded-xl flex items-center gap-3 text-lg"
                                >
                                    {isSending ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <>
                                            <FaPaperPlane /> إرسال الإشعار
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
