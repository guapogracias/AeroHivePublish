import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import ProcessPhases from '@/components/ProcessPhases';
import EdgeValues from '@/components/EdgeValues';
import ScrollShowcase from '@/components/ScrollShowcase';

export default function OverviewPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--bg-black)]">
      <Hero />
      <Mission />
      <ScrollShowcase />
      <ProcessPhases />
      <EdgeValues />
    </main>
  );
}
