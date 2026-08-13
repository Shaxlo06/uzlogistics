"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminLoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/companies");
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 sm:px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy dark:text-white">
        <LockKeyhole className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">{t("admin.loginTitle")}</h1>

      <form onSubmit={onSubmit} className="mt-6 w-full space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("admin.username")}</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("admin.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </div>
        {error && <p className="text-xs text-brand-red">{t("admin.loginError")}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
        >
          {t("admin.loginButton")}
        </button>
      </form>
    </div>
  );
}
