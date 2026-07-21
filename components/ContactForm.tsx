'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass-strong flex min-h-[420px] flex-col items-center justify-center rounded-3xl p-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-[#5ec8ff]" />
        <h2 className="mt-5 text-2xl font-bold text-white">پیام شما ثبت شد</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
          این فرم در نسخه دمو ثبت نمایشی انجام می‌دهد. کارشناسان پایا یدک در نسخه نهایی با شما
          تماس خواهند گرفت.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
        >
          ارسال پیام دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-white/65">نام و نام خانوادگی</span>
          <input
            required
            name="name"
            className="h-12 w-full border border-white/12 bg-white/5 px-4 text-white outline-none transition focus:border-[#3aa0ff]"
            placeholder="نام شما"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-white/65">شماره تماس</span>
          <input
            required
            name="phone"
            inputMode="tel"
            dir="ltr"
            className="h-12 w-full border border-white/12 bg-white/5 px-4 text-left text-white outline-none transition focus:border-[#3aa0ff]"
            placeholder="09..."
          />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-white/65">موضوع درخواست</span>
          <select
            name="subject"
            className="h-12 w-full border border-white/12 bg-[#071431] px-4 text-white outline-none transition focus:border-[#3aa0ff]"
          >
            <option>استعلام قیمت قطعه</option>
            <option>مشاوره فنی</option>
            <option>پیگیری سفارش</option>
            <option>همکاری تجاری</option>
          </select>
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-white/65">پیام</span>
          <textarea
            required
            name="message"
            rows={6}
            className="w-full resize-none border border-white/12 bg-white/5 p-4 text-white outline-none transition focus:border-[#3aa0ff]"
            placeholder="نام قطعه، شماره فنی یا مدل خودرو را بنویسید"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[var(--neon-orange)] px-6 font-semibold text-white transition hover:brightness-110 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        ارسال پیام
      </button>
    </form>
  );
}
