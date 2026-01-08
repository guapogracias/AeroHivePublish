import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import ScrollShowcase from '@/components/ScrollShowcase';
import OverviewInsert from '@/components/OverviewInsert';
import { EarthScroll } from '@/components/EarthScroll';

export default function OverviewPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--bg-black)]">
      <Hero />
      <EarthScroll />
      <Mission />
      <OverviewInsert />
      <ScrollShowcase />
    </main>
  );
}
