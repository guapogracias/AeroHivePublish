"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "System", href: "/system" },
  { label: "Application", href: "/coverage" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // read current theme (set by `app/layout.tsx` theme-init script)
    const el = document.documentElement;
    const current = (el.getAttribute("data-theme") as "dark" | "light" | null) ?? "dark";
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const nextTheme = useMemo(() => (theme === "dark" ? "light" : "dark"), [theme]);

  function applyTheme(t: "dark" | "light") {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {
      // ignore
    }
  }

  return (
    <header className="sticky top-0 z-50 min-h-[64px] border-b border-[var(--divider)] bg-[var(--bg-header)] backdrop-blur-sm flex items-center">
      <div className="container-main relative w-full">
        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div className="header-grid relative grid items-center h-[54px]">
          {/* Logo - Column 1 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 px-4">
              <Image
                src="/images/logo.svg"
                alt="AeroHive Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Mobile: Right side actions - Column 2 */}
          <div className="flex items-center justify-end gap-4 px-4 md:hidden">
            <button
              type="button"
              onClick={() => applyTheme(nextTheme)}
              aria-label={`Switch to ${nextTheme} theme`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--divider)] bg-transparent text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button 
              className="text-[var(--text-primary)]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop: Navigation - Columns 2-3 */}
          <nav className="hidden md:col-span-2 md:flex items-center justify-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-0.5 px-3 text-small font-semibold transition-colors ${
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: Right side actions - Column 4 */}
          <div className="hidden md:flex items-center justify-end gap-4 px-4">
            <button
              type="button"
              onClick={() => applyTheme(nextTheme)}
              aria-label={`Switch to ${nextTheme} theme`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--divider)] bg-transparent text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--divider)]">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-6 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

