"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaTicketAlt,
  FaStore,
  FaCog,
  FaSignOutAlt,
  FaBriefcase,
  FaHeadset,
  FaBell,
  FaChevronDown,
  FaUser,
  FaSpinner,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types/app.types";
import Button from "../ui/Button";
import LoginModal from "../modals/LoginModal";
import JobModal from "../modals/JobModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState("");
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleOpenAuth = () => setIsLoginModalOpen(true);
    const handleOpenJob = () => setIsJobModalOpen(true);
    const handleShowLoader = (e: any) => {
      setGlobalLoadingMessage(e.detail || "جاري التحميل...");
      setIsGlobalLoading(true);
    };

    window.addEventListener("openAuthModal", handleOpenAuth);
    window.addEventListener("openJobModal", handleOpenJob);
    window.addEventListener("showGlobalLoader", handleShowLoader);
    return () => {
      window.removeEventListener("openAuthModal", handleOpenAuth);
      window.removeEventListener("openJobModal", handleOpenJob);
      window.removeEventListener("showGlobalLoader", handleShowLoader);
    };
  }, []);

  useEffect(() => {
    // Clear loader when navigation completes (pathname changes)
    setIsGlobalLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Close dropdowns and modals when clicking outside
      if (
        !target.closest(".profile-dropdown-container") &&
        !target.closest(".notification-dropdown-container")
      ) {
        if (isProfileOpen) setIsProfileOpen(false);
        if (isNotificationsOpen) setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileOpen, isNotificationsOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const fetchNotifications = async (userId: string) => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
      }
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data }) => setProfile(data));
        fetchNotifications(user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
        fetchNotifications(session.user.id);
      } else {
        setProfile(null);
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/", icon: FaTicketAlt },
    { name: "المتجر", href: "/store", icon: FaStore },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-dark/80 backdrop-blur-lg border-b border-white/10 py-3" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          {/* Spacer to push Auth to the left in RTL flex-between layout */}
          <div className="w-10 hidden md:block" />

          {/* Desktop Nav - Centered Absolutely */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (pathname !== link.href) {
                    window.dispatchEvent(new CustomEvent('showGlobalLoader', { detail: `جاري التوجه إلى ${link.name}...` }));
                  }
                }}
                className={`text-sm font-bold transition-all hover:text-primary flex items-center gap-2 ${pathname === link.href ? "text-primary" : "text-white"}`}
              >
                <link.icon className="text-lg" />
                {link.name}
              </Link>
            ))}

            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-bold text-sky-400 hover:text-white flex items-center gap-2"
              >
                <FaCog /> لوحة التحكم
              </Link>
            )}
          </nav>

          {/* Auth / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications button */}
                <div className="relative hidden md:block notification-dropdown-container">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      if (!isNotificationsOpen) setIsProfileOpen(false);
                      if (!isNotificationsOpen && unreadCount > 0 && user) {
                        await supabase
                          .from("notifications")
                          .update({ is_read: true })
                          .eq("user_id", user.id)
                          .eq("is_read", false);
                        setUnreadCount(0);
                      }
                    }}
                    className="relative hover:bg-white/5 p-2 rounded-full transition-colors flex"
                  >
                    <FaBell className="text-xl text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-14 left-0 w-80 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-right"
                      >
                        <div className="p-4 border-b border-white/5">
                          <h3 className="font-bold text-white text-lg">
                            الإشعارات
                          </h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((notif: any) => (
                              <div
                                key={notif.id}
                                className="flex gap-3 items-start hover:bg-white/5 p-2 rounded-xl transition-colors cursor-pointer"
                              >
                                {!notif.is_read && (
                                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_10px_#0ea5e9]" />
                                )}
                                <div>
                                  <p
                                    className={`text-sm leading-relaxed ${!notif.is_read ? "text-white font-bold" : "text-gray-300"}`}
                                  >
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.message}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 text-sm py-4">
                              مافي إشعارات الحين
                            </div>
                          )}
                        </div>
                        <div className="p-3 border-t border-white/5 text-center flex flex-col gap-2">
                          <button className="text-sm font-bold text-gray-400 bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer w-full">
                            شوف كل الإشعارات
                          </button>
                          <Link href="/chat" className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary hover:text-dark p-2 rounded-xl transition-colors flex items-center justify-center gap-2 w-full">
                            <FaHeadset /> الدعم الفني المباشر
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      if (!isProfileOpen) setIsNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-full transition-all"
                  >
                    <img
                      src={
                        profile?.avatar_url ||
                        user?.user_metadata?.avatar_url ||
                        "/assets/images/1.svg"
                      }
                      className="w-10 h-10 rounded-full border-2 border-primary/50 hover:border-primary transition-all"
                      alt="Profile"
                    />
                    <FaChevronDown
                      className={`text-xs text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-14 left-0 w-64 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        {/* Profile Info */}
                        <div className="p-4 border-b border-white/5 text-right">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="font-bold text-white text-sm">
                                {profile?.full_name || user?.email}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {user?.email}
                              </p>
                            </div>
                            <img
                              src={
                                profile?.avatar_url ||
                                user?.user_metadata?.avatar_url ||
                                "/assets/images/1.svg"
                              }
                              className="w-10 h-10 rounded-full border border-primary"
                              alt="Profile"
                            />
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FaUser className="text-primary" /> حسابي
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FaBriefcase className="text-primary" /> طلباتي
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FaCog className="text-primary" /> الإعدادات
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              window.dispatchEvent(new CustomEvent('openJobModal'));
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FaBriefcase className="text-primary" /> التوظيف
                          </button>
                          <Link
                            href="/chat"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                          >
                            <FaHeadset className="text-primary" /> فزعة (الدعم الفني)
                          </Link>
                          <button
                            onClick={async () => {
                              window.dispatchEvent(new CustomEvent('showGlobalLoader', { detail: 'جاري تسجيل الخروج...' }));
                              setIsProfileOpen(false);
                              await supabase.auth.signOut();
                              setIsGlobalLoading(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium mt-2 border-t border-white/5 text-right"
                          >
                            <FaSignOutAlt /> إطلع من الحساب
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2"
              >
                <FaSignInAlt /> حياك، سجل دخول
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 text-white text-2xl p-2"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-dark z-40 md:hidden pt-24 px-8 overflow-y-auto"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      if (pathname !== link.href) {
                        window.dispatchEvent(new CustomEvent('showGlobalLoader', { detail: `جاري التوجه إلى ${link.name}...` }));
                      }
                      setIsOpen(false);
                    }}
                    className="text-2xl font-bold flex items-center gap-4 text-white"
                  >
                    <link.icon className="text-primary" />
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-white/10 my-4" />

                {!user && (
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full text-xl py-4 flex items-center justify-center gap-2"
                  >
                    <FaSignInAlt /> حياك، سجل دخول
                  </Button>
                )}

                {user && (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={
                          profile?.avatar_url ||
                          `https://ui-avatars.com/api/?name=U&background=38bdf8`
                        }
                        className="w-12 h-12 rounded-full border border-primary"
                        alt="Profile"
                      />
                      <div>
                        <div className="font-bold text-lg text-white">
                          {profile?.full_name || "المستخدم"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {profile?.email}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="text-xl flex items-center gap-4 text-white"
                    >
                      <FaCog className="text-gray-400" /> الإعدادات
                    </Link>
                    <Link
                      href="/chat"
                      onClick={() => setIsOpen(false)}
                      className="text-xl flex items-center gap-4 text-white"
                    >
                      <FaHeadset className="text-gray-400" /> فزعة (الدعم الفني)
                    </Link>
                    <Button
                      variant="danger"
                      className="w-full text-xl py-4 flex items-center justify-center gap-2 mt-4"
                      onClick={async () => {
                        window.dispatchEvent(new CustomEvent('showGlobalLoader', { detail: 'جاري تسجيل الخروج...' }));
                        await supabase.auth.signOut();
                        setIsOpen(false);
                        setIsGlobalLoading(false);
                      }}
                    >
                      <FaSignOutAlt /> إطلع من الحساب
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {isGlobalLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="card-glass p-8 flex flex-col items-center gap-6 saturate-200">
              <FaSpinner className="text-5xl text-primary animate-spin" />
              <p className="text-white font-bold text-xl">{globalLoadingMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
      />
    </>
  );
}
