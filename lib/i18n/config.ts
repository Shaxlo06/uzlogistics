import uz from "./uz.json";
import ru from "./ru.json";
import en from "./en.json";

export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";
export const LOCALE_COOKIE = "locale";

export const DICTIONARIES = { uz, ru, en } satisfies Record<Locale, typeof uz>;

export type Dictionary = typeof uz;

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function translate(locale: Locale, key: string): string {
  const value = getPath(DICTIONARIES[locale], key);
  if (typeof value === "string") return value;
  const fallback = getPath(DICTIONARIES[DEFAULT_LOCALE], key);
  return typeof fallback === "string" ? fallback : key;
}
