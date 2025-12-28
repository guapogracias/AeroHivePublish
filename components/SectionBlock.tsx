"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import DecryptedText from "./DecryptedText";

interface SectionBlockProps {
  caption: string;
  title: string;
  content: string;
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

export default function SectionBlock({
  caption,
  title,
  content,
  onBack,
  onNext,
  canGoBack = false,
  canGoNext = false,
}: SectionBlockProps) {
  return (
    <div>
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
      <p className="text-h2 text-[var(--text-primary)] mb-4">
        {title}
      </p>
      <p className="text-body-md text-[var(--text-secondary)] mb-6">
        {content}
      </p>

      {/* Navigation controls */}
      {(onBack || onNext) && (
        <div className="flex items-center gap-6 text-[var(--text-primary)] pt-4 border-t border-[var(--divider)]">
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
