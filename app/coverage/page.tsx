import ApplicationWheel from "@/components/ApplicationWheel";

export default function ApplicationPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--bg-black)]">
      <section className="relative flex-1 overflow-hidden">
        {/* Background grid + vertical dotted dividers (matches site aesthetic) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(var(--grid-line-soft) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-line-soft) 1px, transparent 1px)
              `,
              backgroundSize: "160px 160px",
              opacity: 0.18,
            }}
          />

          {/* Vertical dotted lines (7 total: left + 5 internal + right) */}
          <div className="absolute left-0 top-0 bottom-0 dotted-line" />
          <div className="absolute left-[16.666%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[33.333%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[50%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[66.666%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[83.333%] top-0 bottom-0 dotted-line" />
          <div className="absolute right-0 top-0 bottom-0 dotted-line" />
        </div>

        <div className="relative z-10">
          <ApplicationWheel />
        </div>
      </section>
    </main>
  );
}
