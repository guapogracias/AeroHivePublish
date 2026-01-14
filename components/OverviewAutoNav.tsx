"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const HEADER_H = 64;

function scrollToY(y: number) {
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

export default function OverviewAutoNav() {
  const params = useSearchParams();
  const router = useRouter();
  const lastSectionRef = useRef<string>("");
  const lastRunAtRef = useRef<number>(0);

  useEffect(() => {
    const section = (params.get("section") ?? "").toLowerCase();
    if (!section) return;

    // Prevent double-run from React strict mode / re-renders, but still allow
    // new navigations to different sections.
    const now = Date.now();
    if (lastSectionRef.current === section && now - lastRunAtRef.current < 800) return;
    lastSectionRef.current = section;
    lastRunAtRef.current = now;

    // Always clear the query param after we navigate so refresh doesn't re-jump.
    const clearParamSoon = () => {
      // Keep scroll position.
      router.replace("/", { scroll: false });
    };

    // Top of page
    if (section === "top" || section === "overview") {
      scrollToY(0);
      setTimeout(clearParamSoon, 500);
      return;
    }

    // Application / Contact: use existing section ids (no new anchors)
    if (section === "application" || section === "contact") {
      const el = document.getElementById(section);
      if (el) {
        const y = window.scrollY + el.getBoundingClientRect().top - HEADER_H;
        scrollToY(y);
      }
      setTimeout(clearParamSoon, 800);
      return;
    }

    // System: auto-enter pinned overlay by scrolling to a point inside EarthScroll that triggers focus.
    if (section === "system") {
      const earth = document.querySelector<HTMLElement>('[data-scroll-target="earthscroll"]');
      if (earth) {
        const rect = earth.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const totalScrollable = Math.max(1, earth.offsetHeight - vh);
        // Pick a ratio that lands on layer index 2 (drones) AND > 75% progress to trigger focus/pin.
        const ratio = 0.78;
        const targetY = window.scrollY + rect.top + ratio * totalScrollable - HEADER_H;
        scrollToY(targetY);
      }
      setTimeout(clearParamSoon, 900);
    }
  }, [params, router]);

  return null;
}


