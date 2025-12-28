"use client";

import Image from "next/image";
import DecryptedText from "./DecryptedText";

interface CoverageBlockProps {
  caption: string;
  title: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
}

export default function CoverageBlock({
  caption,
  title,
  content,
  imageSrc,
  imageAlt,
  reversed = false,
}: CoverageBlockProps) {
  return (
    <section className="relative border-b border-[var(--divider)]">
      <div className="container-main relative">
        <div className="grid grid-cols-2 md:grid-cols-4 min-h-[600px]">
          {/* Vertical Dotted Lines */}
          <div className="absolute left-0 top-0 bottom-0 dotted-line" />
          <div className="absolute left-[50%] md:left-[25%] top-0 bottom-0 dotted-line" />
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 dotted-line" />
          <div className="hidden md:block absolute left-[75%] top-0 bottom-0 dotted-line" />
          <div className="absolute right-0 top-0 bottom-0 dotted-line" />

          {/* Content */}
          <div className={`col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-2 relative z-10`}>
            {/* Text Side */}
            <div 
              className={`flex flex-col justify-center px-4 py-20 md:py-32 ${
                reversed ? "md:order-2 md:border-l border-[var(--divider)]" : "md:order-1 md:border-r border-[var(--divider)]"
              }`}
            >
              <div className="md:max-w-[384px] mx-auto w-full">
                <h3 className="text-h3 text-[var(--text-primary)] mb-6 uppercase">
                  <DecryptedText
                    text={caption}
                    animateOn="view"
                    revealDirection="start"
                    speed={40}
                    maxIterations={15}
                    sequential={true}
                  />
                </h3>
                <h2 className="text-h2 text-[var(--text-primary)] mb-8">
                  {title}
                </h2>
                <p className="text-body-md text-[var(--text-secondary)] leading-relaxed">
                  {content}
                </p>
              </div>
            </div>

            {/* Image Side */}
            <div 
              className={`relative min-h-[200px] md:min-h-full flex items-center justify-center ${
                reversed ? "md:order-1" : "md:order-2"
              }`}
            >
              <div className="relative w-full h-[200px] md:h-[360px]">
                 <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay to blend with dark theme if needed */}
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

