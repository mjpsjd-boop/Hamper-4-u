/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, X, MessageCircle, HelpCircle, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const CONCIERGE_SUGGESTIONS = [
  "Which ring platter matches a dusty-rose pastel theme?",
  "Recommend a complete Nikah certificate and preservation set",
  "How does the flower shipping process work?",
  "Suggest a luxury gift hamper for baby announcement"
];

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Assalamu Alaikum! I am your personal Gifting & Preservation Concierge. I am here to help you design a piece that preserves your dearest memories forever. What celebration or custom piece are you planning?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, chatHistory })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: "I'm having a slight trouble connecting with Tasdiqa's archive. Let me suggest we review our pre-order checklist, or please try typing your query again! ✨" }]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", text: "I am unable to trace our records at the moment. However, I can assure you that all our custom Ring Platters, Nikah Certificates, and Custom Hampers are handpicked with genuine love! ✨" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Badge Button */}
      <button
        id="btn-ai-assistant"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#2D5A27] to-[#1F421B] hover:from-[#35682F] hover:to-[#244C20] text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group border-2 border-[#D4AF37]"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-[#D4AF37]" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-36 transition-all duration-500 ease-out font-sans font-medium text-xs tracking-wider uppercase whitespace-nowrap block">
          AI Concierge
        </span>
      </button>

      {/* Slide-out Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black pointer-events-auto"
            />

            {/* Sidebar drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md md:max-w-xl h-full bg-[#FDFBF7] shadow-xl border-l border-[#D1A39E]/30 flex flex-col pointer-events-auto z-10"
            >
              {/* Gold Header */}
              <div className="bg-gradient-to-r from-[#2D5A27] to-[#1F421B] p-5 text-white flex items-center justify-between border-b-2 border-[#D4AF37]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF5EC]/10 border-2 border-[#D4AF37] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg tracking-wider font-semibold">Tasdiqa's Luxury Concierge</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#FAF5EC]/70">Bespoke Gifting AI</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Message Window Area */}
              <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4">
                {/* Brand Info Banner */}
                <div className="bg-[#FAF0EC] border border-[#D1A39E]/20 rounded-xl p-4 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#D1A39E] shrink-0 mt-0.5" />
                  <div className="font-sans text-xs text-[#524442] space-y-1">
                    <p className="font-medium text-[#1F1716]">Exclusive Studio Guidelines:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-[#5C4D4A]">
                      <li>Orders must be booked <strong>at least 2 months</strong> early</li>
                      <li>Secure custom deliveries India-wide (🇮🇳)</li>
                      <li>Authentic work direct to customers (No resellers allowed)</li>
                    </ul>
                  </div>
                </div>

                {/* Messages mapped */}
                {messages.map((m, index) => (
                  <div
                    key={index}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "bg-[#D1A39E] text-white rounded-tr-none font-medium"
                          : "bg-white text-[#292323] border border-[#D1A39E]/20 rounded-tl-none whitespace-pre-wrap"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {/* Loading indicator bubble */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-[#292323] border border-[#D1A39E]/25 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#D1A39E] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-[#D1A39E] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-[#D1A39E] rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Suggestions Area */}
              {messages.length === 1 && (
                <div className="p-4 bg-[#FAF5EC]/40 border-t border-[#D1A39E]/10">
                  <p className="text-[10px] uppercase font-sans font-medium text-[#7A6A53] tracking-widest mb-2.5">Suggested Inquiries</p>
                  <div className="flex flex-wrap gap-2">
                    {CONCIERGE_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="text-left text-xs bg-white text-[#524442] hover:bg-[#FAF0EC] border border-[#D1A39E]/20 hover:border-[#D1A39E] px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer inline-flex items-center gap-1"
                      >
                        {s}
                        <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Send Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="p-4 border-t border-[#D1A39E]/20 bg-white flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about materials, colors, event theme..."
                  className="flex-1 bg-[#FDFBF7] text-[#1F2937] placeholder-[#A0908C] text-sm font-sans px-4 py-2.5 rounded-xl border border-[#D1A39E]/30 focus:outline-none focus:ring-1 focus:ring-[#2D5A27] focus:border-[#2D5A27] transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-[#2D5A27] text-white p-2.5 rounded-xl flex items-center justify-center hover:bg-[#20421C] active:scale-95 transition disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
