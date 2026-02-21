"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { toast } from "react-hot-toast";

const IMAGES = [
  "/assets/images/modal1.svg",
  "/assets/images/modal2.svg",
  "/assets/images/modal3.svg",
];

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const supabase = createClient();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      toast.error("فشل تسجيل الدخول. حاول مرة أخرى.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" title="">
      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Left Side - Visual with Rotating Stadium Images */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-end relative overflow-hidden bg-dark">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >              <Image
                src={IMAGES[currentImage]}
                alt="Background"
                fill
                priority
                quality={80}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-0" />

          <div className="relative z-10 mb-8">
            <h2 className="text-4xl font-black text-white mb-4 leading-tight drop-shadow-xl">
              ارحب! <br />
              منور في تذكرتي
            </h2>
            <p className="text-white/80 text-lg drop-shadow-md">
              ادخل بحسابك عشان تقدر تطلب وتضبط أمورك ومشاريعك بكل راحة.
            </p>
          </div>

          <div className="relative z-10 flex gap-4">
            {IMAGES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${idx === currentImage ? "w-12 bg-primary" : "w-4 bg-white/30"}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-dark">
          <h3 className="text-2xl font-bold mb-2">تسجيل الدخول</h3>
          <p className="text-gray-400 mb-8">
            ادخل بحساب جوجل أو جيت هب
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => handleLogin("google")}
              variant="outline"
              className="w-full h-14 border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-white flex items-center justify-center gap-4 text-lg font-bold"
            >
              <FaGoogle className="text-xl" /> ادخل بحساب جوجل
            </Button>

            <Button
              onClick={() => handleLogin("github")}
              variant="outline"
              className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-white flex items-center justify-center gap-4 text-lg font-bold"
            >
              <FaGithub className="text-xl" /> ادخل بحساب جيت هب
            </Button>
          </div>

          <p className="mt-8 text-xs text-center text-gray-500">
            بتسجيلك للدخول، أنت توافق على{" "}
            <a href="#" className="text-primary hover:underline">
              شروط الخدمة
            </a>{" "}
            و{" "}
            <a href="#" className="text-primary hover:underline">
              سياسة الخصوصية
            </a>
            .
          </p>
        </div>
      </div>
    </Modal >
  );
}
