// One cookie: the layout reads it to set data-theme before paint, the toggle writes it. Light unless it says dark.
export type Theme = "light" | "dark";
export const THEME_COOKIE = "theme";
// Parent domain in production so the tools can read it too; dev has no shared domain. Mirrors session.ts.
const THEME_DOMAIN = process.env.NODE_ENV === "production" ? "tapt.so" : undefined;
const THEME_MAX_AGE = 60 * 60 * 24 * 365;

export function readTheme(value: string | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

// Browser only: applies the theme to the page and remembers it.
export function writeTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  const domain = THEME_DOMAIN ? `; domain=${THEME_DOMAIN}` : "";
  document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${THEME_MAX_AGE}; samesite=lax${domain}`;
}
