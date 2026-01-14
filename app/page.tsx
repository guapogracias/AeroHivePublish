import Hero from '@/components/Hero';
import ScrollShowcase from '@/components/ScrollShowcase';
import { EarthScroll } from '@/components/EarthScroll';
import ApplicationSection from "@/components/ApplicationSection";
import ContactSection from "@/components/ContactSection";
import OverviewAutoNav from "@/components/OverviewAutoNav";
import { Suspense } from "react";

export default function OverviewPage() {
  return (
    <main className="flex flex-col min-h-screen grid-bg">
      <Suspense fallback={null}>
        <OverviewAutoNav />
      </Suspense>
      <Hero />
      <div data-scroll-target="earthscroll">
        <EarthScroll />
      </div>
      <ScrollShowcase />
      <ApplicationSection showBackground={false} />
      <ContactSection />
    </main>
  );
}
