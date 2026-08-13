"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

// Fake nprogress-style bar: App Router doesn't expose real navigation
// progress, so we optimistically start on internal link clicks and snap to
// 100% once the pathname actually changes.
export function RouteProgressBar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const bumpTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (shouldReduceMotion) return;

    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (anchor.target === "_blank") return;
      if (href === window.location.pathname) return;

      setVisible(true);
      setProgress(15);
      if (bumpTimeout.current) clearTimeout(bumpTimeout.current);
      bumpTimeout.current = setTimeout(() => setProgress(72), 180);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    if (bumpTimeout.current) clearTimeout(bumpTimeout.current);

    setProgress(100);
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [pathname]);

  if (shouldReduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-400"
        animate={{ width: visible ? `${progress}%` : "0%", opacity: visible ? 1 : 0 }}
        transition={{ duration: progress === 100 ? 0.25 : 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
