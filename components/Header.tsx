"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/?section=top" },
  { label: "System", href: "/?section=system" },
  { label: "Application", href: "/?section=application" },
  { label: "Contact", href: "/?section=contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 min-h-[64px] border-b border-white/10 bg-black flex items-center">
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
              className="text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop: Navigation - Columns 2-3 */}
          <nav className="hidden md:col-span-2 md:flex items-center justify-center gap-0.5">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-0.5 px-3 text-small font-semibold transition-colors text-white hover:text-white"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: Right side actions - Column 4 */}
          <div className="hidden md:flex items-center justify-end gap-4 px-4">
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-3 text-base font-semibold transition-colors text-white hover:text-white"
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

