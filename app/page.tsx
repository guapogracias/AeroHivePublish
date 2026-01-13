import Hero from '@/components/Hero';
import ScrollShowcase from '@/components/ScrollShowcase';
import { EarthScroll } from '@/components/EarthScroll';
import ApplicationSection from "@/components/ApplicationSection";
import ContactSection from "@/components/ContactSection";

export default function OverviewPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--bg-black)]">
      <Hero />
      <EarthScroll />
      <ScrollShowcase />
      <ApplicationSection showBackground={false} />
      <ContactSection />
    </main>
  );
}
