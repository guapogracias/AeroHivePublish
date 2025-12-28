# Profound Careers Design System

This document contains the complete design system for the Profound Careers page, including the navigation bar (Header) and footer components. Use this as a reference when porting these components to another project.

---

## Table of Contents

1. [Dependencies](#dependencies)
2. [Design Tokens (CSS Variables)](#design-tokens-css-variables)
3. [Typography System](#typography-system)
4. [Layout Utilities](#layout-utilities)
5. [Header Component](#header-component)
6. [Footer Component](#footer-component)
7. [Component Utilities](#component-utilities)
8. [Implementation Guide](#implementation-guide)

---

## Dependencies

### Required Packages

```json
{
  "dependencies": {
    "next": "16.0.8",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "lucide-react": "^0.559.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "typescript": "^5",
    "tw-animate-css": "^1.4.0"
  }
}
```

### Font Setup

The project uses **Inter** font from Google Fonts:

```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

---

## Design Tokens (CSS Variables)

### Color System

```css
:root {
  /* Background Colors */
  --bg-primary: #0F0F0F;
  --bg-black: #0F0F0F;
  --bg-header: rgba(0, 0, 0, 0.7);

  /* Text Colors */
  --text-primary: #edf2f5;
  --text-secondary: #9f9f9f;
  --text-muted: #828282;
  --text-dark: #222222;

  /* UI Colors */
  --btn-dark: #333333;
  --btn-light: #ffffff;
  --divider: #232323;
  --border: #232323;

  /* Layout */
  --container-max: 1088px;
  --container-padding: 16px;
  --column-width: 264px;

  /* Typography - Letter Spacing */
  --tracking-h1: -2.94px;
  --tracking-h2: -0.3px;
  --tracking-body-lg: -0.045px;
  --tracking-body: -0.2px;
  --radius: 0.625rem;
}
```

### Base Styles

```css
html {
  background-color: var(--bg-black);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: "Inter", "InterVariable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: var(--tracking-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Typography System

### Typography Classes

```css
/* H1 - Hero headings */
.text-h1 {
  font-size: 56px;
  line-height: 64px;
  letter-spacing: -2.94px;
  font-weight: 500;
}

/* H2 - Section headings */
.text-h2 {
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.3px;
  font-weight: 500;
}

/* Body Large */
.text-body-lg {
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.045px;
  font-weight: 400;
}

/* Body Default */
.text-body {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.2px;
  font-weight: 400;
}

/* Body Small */
.text-body-sm {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.2px;
  font-weight: 400;
}

/* Small Text */
.text-small {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
```

---

## Layout Utilities

### Container

```css
.container-main {
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}
```

### Header Grid (Responsive)

```css
.header-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .header-grid {
    grid-template-columns: repeat(4, minmax(0, 264px));
  }
}
```

---

## Component Utilities

### Buttons

```css
/* Primary button (light) */
.btn-primary {
  background-color: var(--btn-light);
  color: var(--text-dark);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  transition: opacity 0.2s ease-in-out;
}

.btn-primary:hover {
  opacity: 0.7;
}

/* Secondary button (dark) */
.btn-secondary {
  background-color: var(--btn-dark);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  transition: opacity 0.2s ease-in-out;
}

.btn-secondary:hover {
  opacity: 0.8;
}
```

---

## Header Component

### Complete Component Code

```tsx
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

export default function Header() {
  const navItems = [
    { label: "Platform", href: "/platform" },
    { label: "Resources", href: "/resources" },
    { label: "Solutions", href: "/solutions" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/careers", active: true },
  ];

  return (
    <header className="sticky top-0 z-50 min-h-[54px] border-b border-[var(--divider)] bg-[var(--bg-header)] backdrop-blur-sm flex items-center">
      <div className="container-main relative w-full">
        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div className="header-grid relative grid items-center h-[54px]">
          {/* Logo - Column 1 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 px-4">
              <img
                src="/profound-logo.svg"
                alt="Profound"
                className="h-4 w-auto"
              />
            </Link>
          </div>

          {/* Mobile: Right side actions - Column 2 */}
          <div className="flex items-center justify-end gap-4 px-4 md:hidden">
            <Link href="/contact-sales" className="btn-primary font-semibold">
              Get a Demo
            </Link>
            <button className="text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop: Navigation - Columns 2-3 */}
          <nav className="hidden md:col-span-2 md:flex items-center justify-center gap-0.5">
            {navItems.map((item, index) => {
              const hasChevron = index < 3; // Platform, Resources, Solutions
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-0.5 px-3 text-small font-semibold transition-colors ${
                    item.active
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                  {hasChevron && <ChevronDown className="h-3 w-3" />}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: Right side actions - Column 4 */}
          <div className="hidden md:flex items-center justify-end gap-4 px-4">
            <Link
              href="/login"
              className="text-small font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Log in
            </Link>
            <Link href="/contact-sales" className="btn-primary font-semibold">
              Get a Demo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Header Component Features

- **Sticky positioning**: Header stays at the top when scrolling
- **Responsive grid**: 2 columns on mobile, 4 columns on desktop (264px each)
- **Logo**: Left-aligned, links to home page
- **Navigation items**: Center-aligned on desktop, hidden on mobile
- **Active state**: Highlights current page
- **Chevron icons**: First 3 nav items have dropdown indicators
- **CTA button**: "Get a Demo" button on both mobile and desktop
- **Mobile menu**: Hamburger icon for mobile navigation (menu functionality not included)
- **Backdrop blur**: Semi-transparent background with blur effect

### Header Grid Structure

**Mobile (2 columns):**
- Column 1: Logo
- Column 2: CTA button + Menu icon

**Desktop (4 columns, 264px each):**
- Column 1: Logo
- Columns 2-3: Navigation items (centered)
- Column 4: Log in link + CTA button

---

## Footer Component

### Complete Component Code

```tsx
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  // Optional: Get dynamic job count from data
  // import jobsData from "../data/jobs.json";
  // const jobCount = jobsData.length;
  const jobCount = 0; // Replace with actual count if needed

  return (
    <footer className="relative w-full bg-[var(--bg-black)] border-t border-[var(--divider)]">
      <div className="container-main relative">
        {/* 4-column grid with responsive columns (264px max, scales down) */}
        <div
          className="relative grid py-12"
          style={{ gridTemplateColumns: 'repeat(4, minmax(0, 264px))' }}
        >
          {/* Column 1: Logo */}
          <div className="px-4">
            <Link href="/" className="inline-block">
              <img
                src="/profound-isotype.svg"
                alt="Profound"
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Column 2: Resources */}
          <div className="px-4">
            <h3 className="text-body-sm text-[var(--text-primary)] font-normal mb-6">
              Resources
            </h3>
            <nav className="flex flex-col gap-4">
              <Link
                href="/blog"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/customers"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Customers
              </Link>
              <Link
                href="/guides"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Guides
              </Link>
              <Link
                href="/developer-docs"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Developer Docs
              </Link>
              <Link
                href="/brand-assets"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Brand Assets
              </Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div className="px-4">
            <h3 className="text-body-sm text-[var(--text-primary)] font-normal mb-6">
              Company
            </h3>
            <nav className="flex flex-col gap-4">
              <Link
                href="/careers"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
              >
                Careers
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm bg-[#333333] text-[var(--text-primary)] text-xs font-normal min-w-[20px]">
                  {jobCount}
                </span>
              </Link>
              <Link
                href="/contact"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/enterprise"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Enterprise
              </Link>
              <Link
                href="/media"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors"
              >
                Media
              </Link>
              <Link
                href="/legal"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
              >
                Legal
                <ChevronDown className="h-3 w-3" />
              </Link>
            </nav>
          </div>

          {/* Column 4: Social */}
          <div className="px-4">
            <h3 className="text-body-sm text-[var(--text-primary)] font-normal mb-6">
              Social
            </h3>
            <nav className="flex flex-col gap-4">
              <Link
                href="https://twitter.com/profound"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[var(--text-secondary)]"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    fill="currentColor"
                  />
                </svg>
                Twitter
              </Link>
              <Link
                href="https://linkedin.com/company/profound"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-[var(--text-secondary)] font-normal hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[var(--text-secondary)]"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="currentColor"
                  />
                </svg>
                LinkedIn
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar - divider spans full width, content constrained to 4 columns */}
      <div className="border-t border-[var(--divider)] pt-6 pb-16">
        <div className="container-main relative">
          <div
            className="relative grid"
            style={{ gridTemplateColumns: 'repeat(4, minmax(0, 264px))' }}
          >
            <div className="col-span-4 flex items-center justify-between px-4">
              {/* Copyright */}
              <div className="text-body-sm font-normal" style={{ color: '#464646' }}>
                © 2025 Profound
              </div>
              
              {/* System Status */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#28FDB0]" />
                <span className="text-body-sm font-normal" style={{ color: '#28FDB0' }}>
                  All systems normal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### Footer Component Features

- **4-column grid layout**: Each column max-width 264px, responsive
- **Logo**: Isotype logo in first column
- **Three link sections**: Resources, Company, Social
- **Hover states**: Links change from secondary to primary text color
- **Badge indicator**: Careers link shows job count badge
- **Social icons**: Inline SVG icons for Twitter and LinkedIn
- **Bottom bar**: Copyright and system status indicator
- **Consistent spacing**: 12px vertical padding, 16px horizontal padding

### Footer Grid Structure

**All breakpoints (4 columns, 264px max each):**
- Column 1: Logo
- Column 2: Resources links
- Column 3: Company links
- Column 4: Social links

**Bottom bar:**
- Spans all 4 columns
- Copyright left-aligned
- System status right-aligned with green indicator dot

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
npm install next react react-dom lucide-react clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/postcss typescript tw-animate-css
```

### Step 2: Set Up CSS Variables

Copy the CSS variables from the [Design Tokens](#design-tokens-css-variables) section into your global CSS file.

### Step 3: Set Up Typography Classes

Copy the typography classes from the [Typography System](#typography-system) section into your global CSS file.

### Step 4: Set Up Layout Utilities

Copy the layout utilities (`.container-main`, `.header-grid`) from the [Layout Utilities](#layout-utilities) section.

### Step 5: Set Up Component Utilities

Copy the button styles from the [Component Utilities](#component-utilities) section.

### Step 6: Create Header Component

1. Create `components/Header.tsx`
2. Copy the Header component code from [Header Component](#header-component)
3. Update logo path (`/profound-logo.svg`) to match your project
4. Update navigation items array to match your routes
5. Update CTA button links as needed

### Step 7: Create Footer Component

1. Create `components/Footer.tsx`
2. Copy the Footer component code from [Footer Component](#footer-component)
3. Update logo path (`/profound-isotype.svg`) to match your project
4. Update all link hrefs to match your routes
5. Update social media links
6. Update copyright year and company name
7. Remove or customize the system status indicator if not needed

### Step 8: Configure Tailwind CSS

Ensure your `tailwind.config` or CSS includes the custom grid utilities:

```css
.header-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .header-grid {
    grid-template-columns: repeat(4, minmax(0, 264px));
  }
}
```

### Step 9: Use in Layout

```tsx
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

---

## Assets Required

### Logo Files

- `/public/profound-logo.svg` - Full logo for header
- `/public/profound-isotype.svg` - Isotype/icon for footer

### Icons

The project uses `lucide-react` for icons:
- `ChevronDown` - Dropdown indicators
- `Menu` - Mobile menu icon

---

## Responsive Breakpoints

- **Mobile**: Default (< 768px)
- **Desktop**: `md:` breakpoint (≥ 768px)

The grid system switches from 2 columns (mobile) to 4 columns (desktop) at the 768px breakpoint.

---

## Customization Notes

### Colors

All colors are defined as CSS variables, making them easy to customize:
- Change `--bg-primary` for main background
- Change `--text-primary` for main text color
- Change `--divider` for border colors
- Change `--btn-light` and `--btn-dark` for button colors

### Typography

Typography uses the Inter font family. To change fonts:
1. Update the font import in your layout
2. Update the `font-family` in the CSS variables

### Spacing

- Container max-width: `1088px`
- Column width: `264px`
- Container padding: `16px`

### Grid System

The design uses a 4-column grid system (264px per column) on desktop, collapsing to 2 columns on mobile. This creates a consistent, structured layout.

---

## Additional Utilities

### Utility Function (Optional)

If you need the `cn` utility for class merging:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Notes

- The Header component includes a mobile menu button, but the menu functionality is not implemented in the provided code
- The Footer includes a system status indicator that can be removed or customized
- All links use Next.js `Link` component - replace with your routing solution if not using Next.js
- The Footer includes a job count badge on the Careers link - remove or customize as needed
- Social media links open in new tabs with proper security attributes (`target="_blank" rel="noopener noreferrer"`)

