"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaUser,
  FaRobot,
  FaCircle,
  FaHeadset,
  FaInfoCircle,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { ChatMessage, Profile } from "@/lib/types/app.types";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { formatRelativeTime } from "@/lib/utils/format";
import ClientTitle from "@/components/ui/ClientTitle";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        toast.error("يجب تسجيل الدخول للوصول للشات");
        window.location.href = "/";
        return;
      }
      setUser(user);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
      fetchMessages(user.id);

      // Realtime subscription
      const channel = supabase
        .channel("public:chat_messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: { new: ChatMessage }) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as ChatMessage];
            });
            if (payload.new.is_admin) {
              toast.success("رسالة جديدة من الإدارة!");
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (userId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    setLoading(true);
    const newMessage = {
      user_id: user.id,
      message: inputValue,
      is_admin: false,
    };

    const { data, error } = await supabase.from("chat_messages").insert([newMessage]).select().single();

    if (error) {
      toast.error("فشل إرسال الرسالة");
    } else {
      setInputValue("");
      if (data) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data as ChatMessage];
        });
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-dark flex flex-col">
      <ClientTitle title="الدعم الفني المباشر" />
      <Header />

      <div className="flex-grow pt-24 pb-12 container mx-auto px-4 md:px-6 flex flex-col h-screen max-h-[900px]">
        {/* Chat Header */}
        <div className="card-glass p-6 mb-6 flex items-center justify-between border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary text-xl">
              <FaHeadset />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                الدعم الفني المباشر
              </h2>
              <div className="flex items-center gap-2 text-xs text-green-500 font-bold">
                <FaCircle className="text-[8px] animate-pulse" /> متاح الآن
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
            <FaInfoCircle /> عادة ما يتم الرد خلال دقائق
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-grow card-glass mb-6 overflow-y-auto p-6 space-y-6 flex flex-col scrollbar-thin scrollbar-thumb-primary">
          {messages.length === 0 ? (
            <div className="m-auto text-center space-y-4 opacity-50">
              <FaPaperPlane className="text-6xl mx-auto text-gray-700" />
              <p className="text-gray-400">
                ابدأ المحادثة الآن واطرح استفساراتك
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, x: msg.is_admin ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={msg.id || i}
                className={`flex ${msg.is_admin ? "justify-start" : "justify-end"} gap-3 items-end`}
              >
                {msg.is_admin && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <FaRobot />
                  </div>
                )}
                <div
                  className={`max-w-[80%] md:max-w-[70%] p-4 rounded-3xl relative ${msg.is_admin ? "bg-primary-gradient text-white rounded-br-none" : "bg-white/5 border border-white/10 text-white rounded-bl-none"}`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <span className="text-[9px] opacity-50 mt-2 block text-left">
                    {formatRelativeTime(msg.created_at)}
                  </span>
                </div>
                {!msg.is_admin && (
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 mb-6 overflow-hidden">
                    <img
                      src="/assets/images/2.svg"
                      alt="U"
                    />
                  </div>
                )}
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="relative group">
          <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
          <div className="relative flex gap-3 p-2 card-glass border-white/10 group-focus-within:border-primary/50 transition-all rounded-3xl">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-grow bg-transparent border-none outline-none px-6 text-white placeholder-gray-500 font-medium"
              disabled={loading}
            />
            <Button
              type="submit"
              isLoading={loading}
              className="h-14 w-14 !rounded-2xl flex items-center justify-center p-0"
            >
              <FaPaperPlane className="transform -rotate-45" />
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
