import NeuralNetworkViz from "./NeuralNetworkViz";

export default function OverviewInsert() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] border-y border-[var(--divider)]">
      {/* Wider, centered container so the visualization can breathe */}
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-10 py-12 md:py-16">
        <div className="w-full">
          <NeuralNetworkViz />
        </div>
      </div>
    </section>
  );
}


