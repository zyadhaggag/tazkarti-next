"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaUserEdit,
  FaBan,
  FaCheck,
  FaSearch,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types/app.types";
import AdminSidebar from "@/components/layouts/AdminSidebar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-hot-toast";
import { fadeInUp, staggerChildren } from "@/lib/utils/animations";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const toggleBan = async (user: Profile) => {
    setUpdating(user.id);
    const { error } = await supabase
      .from("profiles")
      .update({ banned: !user.banned })
      .eq("id", user.id);

    if (error) {
      toast.error("فشل تحديث حالة الحظر");
    } else {
      toast.success(user.banned ? "تم إلغاء الحظر" : "تم حظر المستخدم");
      fetchUsers();
    }
    setUpdating(null);
  };

  const toggleRole = async (user: Profile) => {
    setUpdating(user.id);
    const newRole = user.role === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", user.id);

    if (error) {
      toast.error("فشل تحديث الصلاحيات");
    } else {
      toast.success(
        `تم تغيير الرتبة إلى ${newRole === "admin" ? "أدمن" : "مستخدم"}`,
      );
      fetchUsers();
    }
    setUpdating(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row rtl">
      <AdminSidebar />

      <main className="flex-grow lg:mr-72 p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                إدارة <span className="text-primary">المستخدمين</span>
              </h1>
              <p className="text-gray-500">
                تحكم في الصلاحيات، احظر المخالفين، وراقب نشاط المجتمع.
              </p>
            </div>
            <div className="card-glass px-6 py-3 flex items-center gap-3 text-sm font-bold border-l-4 border-green-500">
              <FaShieldAlt className="text-green-500" /> ميزة حماية مفعلة
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="relative mb-8">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 glass border-white/10 rounded-xl pr-12 pl-6 focus:border-primary outline-none transition-all"
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="px-6 py-4 font-black">المستخدم</th>
                    <th className="px-6 py-4 font-black">الرتبة</th>
                    <th className="px-6 py-4 font-black">الحالة</th>
                    <th className="px-6 py-4 font-black">تاريخ الانضمام</th>
                    <th className="px-6 py-4 font-black">خيارات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Spinner />
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="group hover:bg-white/5 transition-all text-white"
                      >
                        <td className="px-6 py-5 flex items-center gap-4">
                          <img
                            src="/assets/images/2.svg"
                            className="w-10 h-10 rounded-full border border-white/10"
                            alt=""
                          />
                          <div>
                            <div className="font-bold text-sm">
                              {u.full_name || "بدون اسم"}
                            </div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1 font-bold italic lowercase tracking-tight">
                              <FaEnvelope className="text-[8px]" /> {u.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${u.role === "admin" ? "bg-primary/10 border-primary/20 text-primary" : "bg-gray-500/10 border-gray-500/20 text-gray-500"}`}
                          >
                            {u.role === "admin" ? "مدير" : "مستعمل"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`flex items-center gap-2 text-[10px] font-black uppercase ${u.banned ? "text-red-500" : "text-green-500"}`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${u.banned ? "bg-red-500 shadow-[0_0_5px_red]" : "bg-green-500 shadow-[0_0_5px_#22c55e]"}`}
                            />
                            {u.banned ? "محظور" : "نشط"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-400 text-xs font-bold">
                          {new Date(u.created_at).toLocaleDateString("ar-SA")}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleRole(u)}
                              disabled={updating === u.id}
                              className="w-9 h-9 rounded-lg glass border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all text-xs"
                              title="تغيير الرتبة"
                            >
                              <FaUserShield />
                            </button>
                            <button
                              onClick={() => toggleBan(u)}
                              disabled={updating === u.id}
                              className={`w-9 h-9 rounded-lg glass border-white/10 flex items-center justify-center transition-all text-xs ${u.banned ? "hover:bg-green-500/20 hover:text-green-500" : "hover:bg-red-500/20 hover:text-red-500"}`}
                              title={u.banned ? "إلغاء حظر" : "حظر"}
                            >
                              {u.banned ? <FaCheck /> : <FaBan />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
