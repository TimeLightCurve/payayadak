'use client';

import { useState } from 'react';
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function ProductActions() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 items-center border border-white/15 bg-white/5">
          <button
            type="button"
            aria-label="کاهش تعداد"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-full w-11 items-center justify-center text-white/70 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center font-bold text-white">{quantity.toLocaleString('fa-IR')}</span>
          <button
            type="button"
            aria-label="افزایش تعداد"
            onClick={() => setQuantity((current) => current + 1)}
            className="flex h-full w-11 items-center justify-center text-white/70 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setAdded(true);
            window.setTimeout(() => setAdded(false), 2200);
          }}
          className="flex h-12 flex-1 items-center justify-center gap-2 bg-[var(--neon-orange)] px-5 font-semibold text-white transition hover:brightness-110"
        >
          {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          {added ? 'به سبد اضافه شد' : 'افزودن به سبد'}
        </button>
      </div>
      <p className="text-xs text-white/45">قیمت و موجودی برای نسخه دمو هستند.</p>
    </div>
  );
}
