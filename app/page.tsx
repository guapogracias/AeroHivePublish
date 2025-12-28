import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import ProcessPhases from '@/components/ProcessPhases';
import EdgeValues from '@/components/EdgeValues';
import Team from '@/components/Team';

export default function OverviewPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--bg-black)]">
      <Hero />
      <Mission />
      <ProcessPhases />
      <EdgeValues />
      <Team />
    </main>
  );
}
