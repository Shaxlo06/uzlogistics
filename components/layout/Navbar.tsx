"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Menu, X, Boxes, Search, LayoutDashboard } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES, Locale } from "@/lib/i18n/config";
import { RouteProgressBar } from "./RouteProgressBar";
import { CommandPalette } from "./CommandPalette";

const LOCALE_LABEL: Record<Locale, string> = { uz: "UZ", ru: "RU", en: "EN" };

export function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 40;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  // Reset transient UI state on route change (React-recommended pattern: adjust
  // state during render instead of in an effect, to avoid a cascading re-render).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/companies", label: t("nav.companies") },
    { href: "/map", label: t("nav.map") },
    { href: "/analytics", label: t("nav.analytics") },
  ];

  const pillTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.7 };

  const mobileNavItems = [
    { href: "/", label: t("nav.home") },
    { href: "/companies", label: t("nav.companies") },
    { href: "/map", label: t("nav.map") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/analytics", label: t("nav.analytics") },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${
          scrolled
            ? "border-b border-black/5 bg-white/90 py-2.5 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/90"
            : "border-b border-transparent bg-white/60 py-4 backdrop-blur-xl dark:bg-slate-950/60"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <Boxes className="h-6 w-6 shrink-0 text-brand-blue transition-transform duration-200 group-hover:scale-110" aria-hidden />
            <span className="text-sm font-bold text-brand-navy dark:text-white sm:text-base">uzlogisticsnet</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
            {navItems.map((item) => (
              <NavPillLink
                key={item.href}
                item={item}
                active={pathname === item.href}
                hovered={hovered === item.href}
                onHover={() => setHovered(item.href)}
                pillTransition={pillTransition}
              />
            ))}

            {/* Dashboard CTA — distinct gradient pill with one-time shine */}
            <Link
              href="/dashboard"
              className="dashboard-cta relative ml-2 flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-[1.03]"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
              {t("nav.dashboard")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-1.5 rounded-md border border-[var(--border-hairline)] px-2.5 py-1.5 text-xs text-muted transition-colors hover:text-brand-blue sm:flex"
              aria-label="Command palette"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="rounded border border-[var(--border-hairline)] px-1 font-mono text-[10px]">⌘K</kbd>
            </button>

            <LocaleSwitcher locale={locale} setLocale={setLocale} pillTransition={pillTransition} />

            <Link
              href="/admin/login"
              className="hidden rounded-md border border-brand-navy/20 px-3 py-1.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5 dark:border-white/20 dark:text-white sm:block"
            >
              {t("nav.admin")}
            </Link>

            <button
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <RouteProgressBar />
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--surface)] lg:hidden"
          >
            <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-24">
              <motion.nav
                className="flex flex-col gap-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.04 } },
                }}
              >
                {mobileNavItems.map((item) => (
                  <MobileNavItem key={item.href} href={item.href} label={item.label} onClick={() => setMobileOpen(false)} />
                ))}

                <motion.div variants={mobileItemVariants(shouldReduceMotion)}>
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-brand-navy dark:text-white"
                  >
                    {t("nav.admin")}
                  </Link>
                </motion.div>

                <motion.div variants={mobileItemVariants(shouldReduceMotion)} className="mt-4 flex items-center gap-2 px-3">
                  {LOCALES.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocale(l)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        locale === l ? "bg-brand-blue text-white" : "border border-[var(--border-hairline)] text-muted"
                      }`}
                    >
                      {LOCALE_LABEL[l]}
                    </button>
                  ))}
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}

function mobileItemVariants(shouldReduceMotion: boolean | null) {
  return {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" as const } },
  };
}

function MobileNavItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div variants={mobileItemVariants(shouldReduceMotion)}>
      <Link
        href={href}
        onClick={onClick}
        className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-brand-blue/10 ${
          pathname === href ? "text-brand-blue" : "text-foreground/80"
        }`}
      >
        {label}
      </Link>
    </motion.div>
  );
}

function NavPillLink({
  item,
  active,
  hovered,
  onHover,
  pillTransition,
}: {
  item: { href: string; label: string };
  active: boolean;
  hovered: boolean;
  onHover: () => void;
  pillTransition: { type: "spring"; stiffness: number; damping: number; mass: number } | { duration: number };
}) {
  return (
    <div className="relative" onMouseEnter={onHover}>
      {hovered && (
        <motion.span layoutId="nav-hover-pill" className="absolute inset-0 rounded-full bg-brand-blue/10" transition={pillTransition} />
      )}
      <Link href={item.href} className="group relative z-10 block px-3.5 py-2">
        <span
          className={`relative inline-block text-sm font-medium transition-all duration-150 group-hover:-translate-y-0.5 ${
            active ? "text-brand-blue" : "text-foreground/80 group-hover:text-brand-blue"
          }`}
        >
          {item.label}
          <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-brand-blue transition-transform duration-200 group-hover:scale-x-100" />
        </span>
      </Link>
    </div>
  );
}

function LocaleSwitcher({
  locale,
  setLocale,
  pillTransition,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  pillTransition: { type: "spring"; stiffness: number; damping: number; mass: number } | { duration: number };
}) {
  return (
    <div className="hidden items-center gap-0.5 rounded-full border border-[var(--border-hairline)] p-1 sm:flex">
      {LOCALES.map((l) => (
        <motion.button
          key={l}
          onClick={() => setLocale(l)}
          whileTap={{ scale: 0.9 }}
          className="relative rounded-full px-2.5 py-1 text-xs font-semibold"
        >
          {locale === l && (
            <motion.span layoutId="locale-pill" className="absolute inset-0 -z-10 rounded-full bg-brand-blue" transition={pillTransition} />
          )}
          <span className={`relative transition-colors duration-200 ${locale === l ? "text-white" : "text-muted"}`}>
            {LOCALE_LABEL[l]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
