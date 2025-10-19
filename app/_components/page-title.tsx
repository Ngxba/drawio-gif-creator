'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
// oxlint-disable-next-line no-named-as-default
import gsap from 'gsap';

export function PageTitle() {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current || !cursorRef.current) return;

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
      });

      // Cursor blink animation that runs throughout
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      // Forward: diagram.drawio -> diagram -> diagram.gif
      timeline
        // Delete ".drawio" to show "diagram" (right to left)
        .to(textRef.current, {
          text: {
            value: 'diagram',
            rtl: true,
          },
          duration: 1.5,
          ease: 'none',
        })
        // Pause at "diagram"
        .to({}, { duration: 0.1 })
        // Type ".gif"
        .to(textRef.current, {
          text: 'diagram.gif',
          duration: 1.2,
          ease: 'none',
        });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="text-center mb-12">
      <h1 className="text-5xl font-bold mb-3 font-typing">
        <span
          ref={textRef}
          className="text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text"
        >
          diagram.drawio
        </span>
        <span
          ref={cursorRef}
          className="ml-1 inline-block h-12 w-1 bg-gradient-to-r from-primary to-primary/70 align-middle"
        />
      </h1>
      <p className="text-lg text-muted-foreground">
        Convert your draw.io diagrams into animated GIF images
      </p>
    </div>
  );
}
