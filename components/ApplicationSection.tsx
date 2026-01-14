"use client";

import ApplicationWheel from "@/components/ApplicationWheel";

export default function ApplicationSection({
  showBackground = true,
  id = "application",
}: {
  showBackground?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative w-full grid-bg border-y border-[var(--divider)]"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {showBackground ? (
        <div className="absolute inset-0 pointer-events-none">
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

          <div className="absolute left-0 top-0 bottom-0 dotted-line" />
          <div className="absolute left-[16.666%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[33.333%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[50%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[66.666%] top-0 bottom-0 dotted-line" />
          <div className="absolute left-[83.333%] top-0 bottom-0 dotted-line" />
          <div className="absolute right-0 top-0 bottom-0 dotted-line" />
        </div>
      ) : null}

      <div className="relative z-10 w-full h-full">
        <ApplicationWheel />
      </div>
    </section>
  );
}


