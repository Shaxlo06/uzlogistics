"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { REGIONS } from "@/lib/regions";

type Company = {
  id: string;
  name: string;
  legalName: string | null;
  region: string;
  district: string | null;
  address: string | null;
  phonePrefix: string | null;
  description: string | null;
  website: string | null;
  workMode: string | null;
  likesCount: number;
  isProducer: boolean;
  isExporter: boolean;
};

const EMPTY_FORM: {
  name: string;
  legalName: string;
  region: string;
  district: string;
  address: string;
  phonePrefix: string;
  description: string;
  website: string;
  workMode: string;
} = {
  name: "",
  legalName: "",
  region: REGIONS[0],
  district: "",
  address: "",
  phonePrefix: "",
  description: "",
  website: "",
  workMode: "09:00-18:00",
};

export function AdminCompaniesClient({
  initialCompanies,
  username,
}: {
  initialCompanies: Company[];
  username: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function startEdit(c: Company) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      legalName: c.legalName ?? "",
      region: c.region,
      district: c.district ?? "",
      address: c.address ?? "",
      phonePrefix: c.phonePrefix ?? "",
      description: c.description ?? "",
      website: c.website ?? "",
      workMode: c.workMode ?? "",
    });
    setShowForm(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/companies/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setCompanies((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...data.company } : c)));
          setShowForm(false);
        }
      } else {
        const res = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setCompanies((prev) => [data.company, ...prev]);
          setShowForm(false);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
    if (res.ok) setCompanies((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white">
            {t("admin.companiesTitle")}
          </h1>
          <p className="text-xs text-muted">{username}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" /> {t("admin.addCompany")}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] px-4 py-2 text-sm font-medium text-muted hover:text-brand-red"
          >
            <LogOut className="h-4 w-4" /> {t("admin.logout")}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={onSave}
          className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5 sm:grid-cols-2"
        >
          <input
            required
            placeholder="Nomi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          <input
            placeholder="Yuridik nomi"
            value={form.legalName}
            onChange={(e) => setForm({ ...form, legalName: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          <select
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            placeholder="Tuman"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          <input
            placeholder="Manzil"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue sm:col-span-2"
          />
          <input
            placeholder="Telefon prefiksi (+998 90 123)"
            value={form.phonePrefix}
            onChange={(e) => setForm({ ...form, phonePrefix: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          <input
            placeholder="Ish rejimi"
            value={form.workMode}
            onChange={(e) => setForm({ ...form, workMode: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          <textarea
            placeholder="Tavsif"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-[var(--border-hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue sm:col-span-2"
            rows={3}
          />
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {t("admin.save")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-[var(--border-hairline)] px-4 py-2 text-sm font-medium text-muted"
            >
              {t("admin.cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Nomi</th>
              <th className="px-4 py-3 font-medium">Viloyat</th>
              <th className="px-4 py-3 font-medium">Yoqtirish</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-[var(--border-hairline)] last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted">{c.region}</td>
                <td className="px-4 py-3 text-muted">{c.likesCount}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startEdit(c)} className="text-brand-blue hover:opacity-70">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(c.id)} className="text-brand-red hover:opacity-70">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
