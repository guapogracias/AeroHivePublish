"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import DecryptedText from "./DecryptedText";
import ImageCompareSlider from "./ImageCompareSlider";
import NeuralNetworkViz from "./NeuralNetworkViz";
import type { SectionMedia } from "@/types/sections";

interface SectionBlockProps {
  caption: string;
  title: string;
  content: string;
  media?: SectionMedia;
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

export default function SectionBlock({
  caption,
  title,
  content,
  media,
  onBack,
  onNext,
  canGoBack = false,
  canGoNext = false,
}: SectionBlockProps) {
  const isDiagram = media?.type === "diagram";

  return (
    <div>
      {caption ? (
        <h3 className="text-h3 text-[var(--text-primary)] mb-3">
          <DecryptedText
            text={caption}
            animateOn="view"
            revealDirection="start"
            speed={40}
            maxIterations={15}
            sequential={true}
          />
        </h3>
      ) : null}

      {title ? (
        <p className="text-h2 text-[var(--text-primary)] mb-4">
          {title}
        </p>
      ) : null}

      {content ? (
        <p className="text-body-md text-[var(--text-secondary)] mb-6">
          {content}
        </p>
      ) : null}

      {media?.type === "video" ? (
        <div className="mb-6">
          <video
            className="w-full rounded-lg border border-[var(--divider)] bg-black/40"
            src={media.src}
            poster={media.poster}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      ) : null}

      {media?.type === "image" ? (
        <div className="mb-6">
          <img
            className="w-full rounded-lg border border-[var(--divider)] bg-black/40"
            src={media.src}
            alt={media.alt ?? title}
          />
        </div>
      ) : null}

      {media?.type === "slider" ? (
        <div className="mb-6">
          <ImageCompareSlider
            leftLabel="Single Photo"
            rightLabel="Point Cloud"
            leftImageSrc={media.leftImageSrc ?? "/images/islandphoto.png"}
            rightImageSrc={media.rightImageSrc ?? "/images/island_gif~1.gif"}
            initial={media.initial ?? 0.6}
            height="min(46vh, 520px)"
            minHeight={320}
            leftImageStyle={
              media.leftImageStyle ?? {
                transform: "scale(1.18) translateY(-2%)",
                transformOrigin: "center",
              }
            }
            rightImageStyle={
              media.rightImageStyle ?? {
                transform: "scale(1.18) translateY(-2%)",
                transformOrigin: "center",
              }
            }
          />
        </div>
      ) : null}

      {media?.type === "diagram" ? (
        <div className="mb-6 rounded-lg border border-[var(--divider)] bg-[var(--surface-1)] p-1 overflow-hidden max-h-[380px] md:max-h-[420px]">
          <div style={{ zoom: 0.75 }}>
            <NeuralNetworkViz variant="compact" />
          </div>
        </div>
      ) : null}

      {/* Navigation controls */}
      {(onBack || onNext) && (
        <div
          className={`flex items-center gap-6 text-[var(--text-primary)] border-t border-[var(--divider)] ${
            isDiagram ? "pt-2" : "pt-4"
          }`}
        >
          {onBack && (
            <button
              onClick={onBack}
              disabled={!canGoBack}
              className={`flex items-center gap-2 text-small font-medium transition-all duration-200 cursor-pointer ${
                !canGoBack
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100 hover:opacity-70"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`flex items-center gap-2 text-small font-medium transition-all duration-200 cursor-pointer ${
                !canGoNext
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100 hover:opacity-70"
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
