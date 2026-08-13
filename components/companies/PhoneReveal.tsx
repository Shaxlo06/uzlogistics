"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

export function PhoneReveal({ prefix, full }: { prefix: string | null; full: string | null }) {
  const [revealed, setRevealed] = useState(false);

  if (!prefix) return null;

  return (
    <button
      onClick={() => setRevealed(true)}
      className="flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-blue/10 hover:text-brand-blue dark:text-white"
    >
      <Phone className="h-4 w-4" />
      {revealed ? full ?? prefix : `${prefix}-XX-XX`}
      {!revealed && <span className="text-xs text-brand-blue">(Telefonni ko&apos;rsatish)</span>}
    </button>
  );
}
