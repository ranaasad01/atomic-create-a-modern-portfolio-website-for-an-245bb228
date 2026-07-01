"use client";

import { useEffect, useState } from "react";

const PROJECT_ID = process.env.NEXT_PUBLIC_ATOMIC_PROJECT_ID ?? "";
const API_BASE = (process.env.NEXT_PUBLIC_ATOMIC_API_URL ?? "").replace(/\/$/, "");
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_ATOMIC_DEFAULT_LOCALE ?? "en";
const LOCALES = (process.env.NEXT_PUBLIC_ATOMIC_LOCALES ?? "en")
  .split(",").map((s) => s.trim()).filter(Boolean);
const LABELS: Record<string, string> = { en: "EN", es: "ES", fr: "FR", de: "DE", pt: "PT", ar: "AR" };

// ponytail: runtime DOM text-swap. Ceiling — client-side only (no per-locale
// SEO) and re-applies on toggle/load, not on every React re-render. Upgrade to
// next-intl [locale] routing if SEO per language matters.
const ORIG = new WeakMap<Text, string>();

function textNodes(): Text[] {
  if (typeof document === "undefined") return [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const out: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    const p = t.parentElement;
    if (!p) continue;
    if (/SCRIPT|STYLE|NOSCRIPT|TEXTAREA/.test(p.tagName)) continue;
    if (p.closest("[data-atomic-lang]")) continue;
    if ((t.textContent ?? "").trim()) out.push(t);
  }
  return out;
}

function collectStrings(): string[] {
  const set = new Set<string>();
  for (const t of textNodes()) {
    const s = (ORIG.get(t) ?? t.textContent ?? "").trim();
    if (s) set.add(s);
  }
  return Array.from(set).slice(0, 400);
}

function applyMap(map: Record<string, string>) {
  for (const t of textNodes()) {
    const orig = ORIG.has(t) ? (ORIG.get(t) as string) : (t.textContent ?? "");
    if (!ORIG.has(t)) ORIG.set(t, orig);
    const key = orig.trim();
    const tr = map[key];
    t.textContent = tr ? orig.replace(key, tr) : orig; // rebuild from original
  }
}

function restore() {
  for (const t of textNodes()) {
    if (ORIG.has(t)) t.textContent = ORIG.get(t) as string;
  }
}

function readCache(loc: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem("atomic_i18n_" + loc);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(loc: string, map: Record<string, string>) {
  try {
    localStorage.setItem("atomic_i18n_" + loc, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

export default function AtomicLangToggle() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  async function applyLocale(target: string) {
    if (target === DEFAULT_LOCALE) {
      restore();
      try { localStorage.setItem("atomic_locale", target); } catch {}
      setLocale(target);
      return;
    }
    // Instant first paint from cache, then re-collect the authoritative map so
    // edited/added copy and owner re-translations sync even with a warm cache.
    const cached = readCache(target);
    if (cached) applyMap(cached);
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/projects/${PROJECT_ID}/i18n/${target}/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strings: collectStrings() }),
        });
        const data = await res.json();
        const map = (data && data.map) || cached || {};
        writeCache(target, map);
        applyMap(map);
      } catch {
        if (!cached) applyMap({});
      }
    } else if (!cached) {
      applyMap({});
    }
    try { localStorage.setItem("atomic_locale", target); } catch {}
    setLocale(target);
  }

  useEffect(() => {
    let saved = DEFAULT_LOCALE;
    try { saved = localStorage.getItem("atomic_locale") || DEFAULT_LOCALE; } catch {}
    if (saved !== DEFAULT_LOCALE) void applyLocale(saved);
    setLocale(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!PROJECT_ID || LOCALES.length < 2) return null;

  return (
    <div
      data-atomic-lang
      className="fixed bottom-5 left-5 z-[9998] flex gap-1 rounded-full border border-gray-200 bg-white/90 backdrop-blur px-1 py-1 shadow-lg font-sans"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => void applyLocale(l)}
          className={
            "px-2.5 py-1 rounded-full text-xs font-semibold transition-colors " +
            (locale === l ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100")
          }
        >
          {LABELS[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
