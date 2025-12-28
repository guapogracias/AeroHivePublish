"use client";

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'chars';
  direction?: 'top' | 'bottom';
}

export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  const initialY = direction === 'top' ? -50 : 50;
  const initialOpacity = 0;
  const initialFilter = 'blur(10px)';

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          className="inline-block will-change-[transform,filter,opacity]"
          initial={{
            filter: initialFilter,
            opacity: initialOpacity,
            y: initialY,
          }}
          animate={
            inView
              ? {
                  filter: 'blur(0px)',
                  opacity: 1,
                  y: 0,
                }
              : {
                  filter: initialFilter,
                  opacity: initialOpacity,
                  y: initialY,
                }
          }
          transition={{
            duration: 0.7,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  );
}
