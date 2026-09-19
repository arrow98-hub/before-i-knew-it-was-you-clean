import { useRef, type CSSProperties } from "react";
import { usePhraseReveal } from "../lib/useStoryMotion";

type ScrollStoryProps = {
  lines: string[];
  className?: string;
  step?: number;
  startOffset?: number;
  endPadding?: number;
};

/** A mobile-first narrative cadence: one thought arrives as the previous recedes. */
export function ScrollStory({
  lines,
  className = "",
  step = 30,
  startOffset = 2,
  endPadding = 8,
}: ScrollStoryProps) {
  const stage = useRef<HTMLDivElement>(null);
  usePhraseReveal(stage);
  return (
    <div
      ref={stage}
      className={`story-reveal ${className}`}
      style={{ height: `${lines.length * step + endPadding}vh` } as CSSProperties}
    >
      {lines.map((line, index) => (
        <p
          className="story-line"
          style={{ top: `${index * step + startOffset}vh` } as CSSProperties}
          key={`${index}-${line}`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
