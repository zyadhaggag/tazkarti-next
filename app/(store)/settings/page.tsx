"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaImage,
  FaShieldAlt,
  FaSave,
  FaCheckCircle,
  FaUserLock,
  FaTrashAlt,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types/app.types";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-hot-toast";
import { fadeInUp } from "@/lib/utils/animations";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    avatarUrl: "",
  });

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

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) {
      setProfile(data);
      setFormData({
        fullName: data.full_name || "",
        avatarUrl: data.avatar_url || "",
      });
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.fullName,
        avatar_url: formData.avatarUrl,
      })
      .eq("id", profile?.id);

    if (error) {
      toast.error("حدث خطأ في تحديث البيانات");
    } else {
      toast.success("تم تحديث بياناتك بنجاح!");
      fetchProfile();
    }
    setSaving(false);
  };


  return (
    <main className="min-h-screen bg-dark">
      <Header />

      <div className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-black/40 border border-white/5 backdrop-blur-3xl rounded-3xl p-6 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Profile Sidebar */}
            <div className="w-full lg:w-1/3 space-y-8 flex flex-col items-center lg:items-start">
              <div className="relative group w-40 h-40">
                <img
                  src="/assets/images/2.svg"
                  className="w-full h-full rounded-full object-cover border-4 border-primary/20 shadow-xl"
                  alt="Avatar"
                />
                <div className="absolute inset-0 bg-dark/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  {loading ? (
                    <div className="w-full h-full bg-white/5 animate-pulse rounded-full" />
                  ) : (
                    <FaImage className="text-3xl text-white" />
                  )}
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-primary">
                  <h4 className="text-xs font-black text-gray-500 uppercase mb-2">
                    البريد الإلكتروني
                  </h4>
                  <p className="text-white font-bold truncate text-sm sm:text-base">
                    {profile?.email}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-sky-400">
                  <h4 className="text-xs font-black text-gray-500 uppercase mb-2">
                    تاريخ الانضمام
                  </h4>
                  <p className="text-white font-bold text-sm sm:text-base">
                    {profile
                      ? new Date(profile.created_at).toLocaleDateString("ar-SA")
                      : "-"}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-green-500 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-gray-500 uppercase mb-2">
                      حالة الحساب
                    </h4>
                    <p className="text-green-500 font-bold flex items-center gap-2">
                      نشط ومفعل <FaCheckCircle />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-grow w-full space-y-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  الإعدادات والملف الشخصي
                </h2>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
                  قم بتحديث بياناتك وضع لمستك الخاصة على حسابك. نحن نهتم
                  بخصوصيتك ولا نشارك بياناتك مع أي طرف.
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <FaUser className="text-primary" /> الاسم الكامل
                  </label>
                  <input
                    value={loading ? "جاري التحميل..." : formData.fullName}
                    disabled={loading}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-lg focus:border-primary focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                    placeholder="الاسم الكامل"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <FaImage className="text-primary" /> رابط الصورة الشخصية
                  </label>
                  <input
                    value={formData.avatarUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, avatarUrl: e.target.value })
                    }
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-lg focus:border-primary focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                  />
                </div>

                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right mt-8">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      حماية البيانات
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      بياناتك الشخصية مشفرة ومؤمنة في خوادمنا حسب أعلى معايير
                      الحماية الدولية.
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    isLoading={saving}
                    className="h-14 px-8 flex-grow text-lg shadow-xl shadow-primary/20"
                  >
                    <FaSave /> حفظ التعديلات
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = "/";
                    }}
                    className="h-14 px-8 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                  >
                    <FaUserLock /> تسجيل الخروج
                  </Button>
                </div>
              </form>

              <div className="pt-10 mt-10 border-t border-white/10">
                <h3 className="text-xl font-black text-red-500 mb-4 flex items-center gap-3">
                  <FaTrashAlt /> منطقة الخطر
                </h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-lg">
                  حذفك للحساب يعني فقدان كل تذاكرك ومنتجاتك المشتراة وتاريخ
                  طلباتك للأبد. لا يمكن استرجاع الحساب أبداً بعد حذفه.
                </p>
                <Button
                  type="button"
                  variant="danger"
                  className="w-full sm:w-auto px-8 h-12 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-none font-bold"
                >
                  حذف الحساب نهائياً
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
