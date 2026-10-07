'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  User,
  Loader2,
  Droplet,
  Minimize2,
  Maximize2,
  Sparkles,
  RotateCcw,
  Bot,
  Heart,
  Shield,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS_BN = [
  { label: 'রক্তদানের যোগ্যতা কী?', icon: '📋' },
  { label: 'O+ রক্ত কাকে দেওয়া যায়?', icon: '🩸' },
  { label: 'জরুরি রক্তের আবেদন কীভাবে করব?', icon: '🚨' },
  { label: 'ডোনার হিসেবে রেজিস্ট্রেশনের নিয়ম কী?', icon: '✍️' },
  { label: 'ব্লাড ডোনেশন ক্যাম্প কোথায় আছে?', icon: '🏥' },
  { label: 'জরুরি হটলাইন নম্বর কত?', icon: '📞' },
];

const QUICK_PROMPTS_EN = [
  { label: 'Blood donation eligibility?', icon: '📋' },
  { label: 'Who can receive O+ blood?', icon: '🩸' },
  { label: 'How to make an emergency blood request?', icon: '🚨' },
  { label: 'How to register as a donor?', icon: '✍️' },
  { label: 'Where are blood donation camps?', icon: '🏥' },
  { label: 'What is the emergency hotline?', icon: '📞' },
];

/**
 * Enhanced Message Formatter with Clickable Phone Call Badges & Markdown Support
 */
function formatMessageContent(content: string) {
  // Convert hotline numbers into clickable call links
  let formatted = content
    .replace(
      /\+8801521711716/g,
      '<a href="tel:+8801521711716" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/40 font-mono text-[11px] font-bold transition-colors">📞 +8801521711716</a>'
    )
    .replace(
      /02-9351969/g,
      '<a href="tel:029351969" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/40 font-mono text-[11px] font-bold transition-colors">☎️ 02-9351969</a>'
    );

  const lines = formatted.split('\n');

  return lines.map((line, i) => {
    // Bold markdown replacement
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>');

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      return (
        <div key={i} className="flex items-start gap-2 mt-1 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(251,113,133,0.8)]" />
          <span
            className="flex-1 text-zinc-200"
            dangerouslySetInnerHTML={{ __html: line.replace(/^[-•*]\s/, '') }}
          />
        </div>
      );
    }

    // Numbered lists
    const numberMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numberMatch) {
      return (
        <div key={i} className="flex items-start gap-2 mt-1 leading-relaxed">
          <span className="text-[10px] font-black font-mono text-rose-400 bg-rose-950/60 border border-rose-500/30 px-1.5 py-0.2 rounded mt-0.5 shrink-0">
            {numberMatch[1]}
          </span>
          <span
            className="flex-1 text-zinc-200"
            dangerouslySetInnerHTML={{ __html: numberMatch[2] }}
          />
        </div>
      );
    }

    // Headings
    if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
      return (
        <div
          key={i}
          className="font-black text-rose-300 mt-2.5 mb-1 text-xs tracking-wide flex items-center gap-1.5 border-b border-rose-500/20 pb-1"
          dangerouslySetInnerHTML={{ __html: line.replace(/^#{1,3}\s/, '') }}
        />
      );
    }

    // Divider
    if (line.trim() === '---') {
      return <div key={i} className="h-[1px] bg-zinc-800/80 my-2" />;
    }

    // Empty lines
    if (line.trim() === '') return <div key={i} className="h-1.5" />;

    return (
      <div
        key={i}
        className="leading-relaxed text-zinc-200"
        dangerouslySetInnerHTML={{ __html: line }}
      />
    );
  });
}

export function ChatBot() {
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const getInitialMessage = useCallback(
    (): Message => ({
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'bn'
          ? '🩸 স্বাগতম! আমি **DropOfLife AI** (রক্তবন্ধু)।\n\nরক্তদান, রক্তের গ্রুপ কম্প্যাটিবিলিটি, জরুরি রক্তের সন্ধান বা প্ল্যাটফর্মের যেকোনো সেবা সম্পর্কে আমাকে প্রশ্ন করতে পারেন। আমি কীভাবে সাহায্য করতে পারি?'
          : "🩸 Welcome! I am **DropOfLife AI** (RaktoBondhu).\n\nFeel free to ask me anything about blood donation, blood group compatibility, finding emergency donors, or navigating our platform. How can I assist you today?",
      timestamp: new Date(),
    }),
    [language]
  );

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smooth scroll to bottom within the chat container only
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleResetChat = () => {
    setMessages([getInitialMessage()]);
    setInput('');
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const payload =
        apiMessages.length === 0
          ? [{ role: 'user', content: text.trim() }]
          : apiMessages;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          data.message ||
          (language === 'bn'
            ? 'দুঃখিত, উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
            : 'Sorry, I could not get a response. Please try again.'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'bn'
              ? '⚠️ নেটওয়ার্ক সমস্যার কারণে উত্তর দেওয়া সম্ভব হচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন বা সরাসরি হটলাইনে কল করুন: **+8801521711716**।'
              : '⚠️ Network error. Please try again shortly or call our 24/7 hotline directly: **+8801521711716**.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickPrompts = language === 'bn' ? QUICK_PROMPTS_BN : QUICK_PROMPTS_EN;

  return (
    <>
      {/* 1. Main Chat Window */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className={`fixed bottom-3 right-2 sm:bottom-6 sm:right-6 z-[9998] flex flex-col rounded-3xl bg-zinc-950/98 border border-rose-500/35 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.98),0_0_40px_rgba(225,29,72,0.18)] backdrop-blur-3xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 ${
            isMinimized
              ? 'h-16 w-[calc(100vw-16px)] sm:w-88'
              : 'h-[580px] max-h-[85vh] w-[calc(100vw-16px)] sm:w-[420px]'
          }`}
        >
          {/* Top Glass Rim Specular Highlight */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-950/90 via-zinc-950/95 to-red-950/80 border-b border-rose-500/20 shrink-0 select-none">
            <div className="flex items-center gap-3">
              {/* Luminous AI Bot Avatar */}
              <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] border border-rose-300/40 shrink-0">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1">
                    DropOfLife AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-rose-500/20 border border-rose-500/40 text-[9px] font-black text-rose-300 font-mono">
                    24/7
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'bn' ? 'রক্তবন্ধু • লাইফসেভার সহকারী' : 'RaktoBondhu • Lifesaver AI'}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Reset Chat */}
              {!isMinimized && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                  title={language === 'bn' ? 'নতুন চ্যাট শুরু করুন' : 'Reset Conversation'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Minimize / Expand */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Messages */}
          {!isMinimized && (
            <>
              {/* Messages Container with Independent Smooth Scroll */}
              <div
                ref={messagesContainerRef}
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 chat-custom-scrollbar overscroll-contain select-text"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(225,29,72,0.4)] border border-rose-400/30">
                        <Droplet className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed transition-all ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 text-white rounded-tr-xs shadow-[0_4px_16px_rgba(225,29,72,0.35)] font-medium'
                          : 'bg-zinc-900/90 text-zinc-100 rounded-tl-xs border border-zinc-700/60 shadow-lg'
                      }`}
                    >
                      <div className="space-y-1">{formatMessageContent(msg.content)}</div>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono ${
                          msg.role === 'user' ? 'text-rose-200/70' : 'text-zinc-500'
                        }`}
                      >
                        <span>
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(225,29,72,0.4)] border border-rose-400/30">
                      <Droplet className="w-3.5 h-3.5 fill-white text-white" />
                    </div>
                    <div className="bg-zinc-900/90 border border-zinc-700/60 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {language === 'bn' ? 'DropOfLife AI চিন্তা করছে...' : 'DropOfLife AI is thinking...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Capsule Gallery */}
              {messages.length <= 1 && (
                <div
                  data-lenis-prevent="true"
                  className="px-3.5 pb-2 flex flex-wrap gap-1.5 shrink-0 max-h-28 overflow-y-auto chat-custom-scrollbar"
                >
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => sendMessage(prompt.label)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-rose-950/60 text-zinc-300 hover:text-rose-200 border border-zinc-700/60 hover:border-rose-500/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span>{prompt.icon}</span>
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90 shrink-0">
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-center gap-2 rounded-2xl bg-zinc-900/90 border border-zinc-700/70 focus-within:border-rose-500/60 focus-within:ring-1 focus-within:ring-rose-500/30 p-1.5 transition-all shadow-inner"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'DropOfLife AI-কে প্রশ্ন করুন...'
                        : 'Ask DropOfLife AI anything...'
                    }
                    className="flex-1 bg-transparent px-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 outline-none"
                    disabled={isLoading}
                  />

                  {input.trim() && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition-colors cursor-pointer"
                      title="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_2px_12px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95"
                    title="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </form>

                <div className="flex items-center justify-between px-1 pt-1.5 text-[9px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    DropOfLife AI • {language === 'bn' ? 'জীবনের এক ফোঁটা' : 'Every Drop Matters'}
                  </span>
                  <span>Enter ↵</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Floating AI Jewel Trigger Button (Enhanced Luminous Jewel Orb) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[9997] flex items-center group">
          {/* Subtle Hover Tooltip Pill */}
          <div className="pointer-events-none absolute right-full mr-3 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/95 border border-rose-500/40 text-xs font-black text-white shadow-xl backdrop-blur-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-rose-400">DropOfLife AI</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300">
              {language === 'bn' ? 'সহায়তার জন্য ক্লিক করুন' : 'Ask Lifesaver AI'}
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white flex items-center justify-center shadow-[0_10px_35px_rgba(225,29,72,0.55)] hover:shadow-[0_12px_50px_rgba(225,29,72,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-rose-300/40 group overflow-hidden"
            aria-label="Open DropOfLife AI Chat"
            id="chatbot-toggle-btn"
          >
            {/* Prismatic Specular Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />

            {/* Glowing Icon Pair: Sparkling AI + Blood Drop */}
            <div className="relative flex items-center justify-center">
              <Droplet className="w-6 h-6 fill-white text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 animate-spin duration-1000" style={{ animationDuration: '6s' }} />
            </div>

            {/* Pulsing Emerald Live Status Pill Dot */}
            <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />

            {/* Ambient Radiating Waves */}
            <span
              className="absolute inset-0 rounded-3xl animate-ping bg-rose-500/25 pointer-events-none"
              style={{ animationDuration: '2.5s' }}
            />
          </button>
        </div>
      )}
    </>
  );
}
