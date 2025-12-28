import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AeroHive",
  description: "AeroHive - Transforming complex landscapes into confident decisions",
  icons: {
    icon: "/images/blacklogo.svg",
    shortcut: "/images/blacklogo.svg",
    apple: "/images/blacklogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`} suppressHydrationWarning>
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col overflow-x-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
