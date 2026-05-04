"use client";

import { useMemo } from "react";

type Decor = {
  kind: "candy" | "star" | "moon" | "bat" | "spider" | "sparkle";
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  hue: string;
  spin: boolean;
};

const HUES = [
  "var(--candy-purple)",
  "var(--candy-orange)",
  "var(--candy-mint)",
  "var(--candy-pink)",
  "var(--candy-yellow)",
];

function pseudoRandom(seed: number) {
  // tiny deterministic RNG so SSR + client match
  let x = seed * 9301 + 49297;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

export function Atmosphere() {
  const items: Decor[] = useMemo(() => {
    const rng = pseudoRandom(42);
    const kinds: Decor["kind"][] = [
      "candy",
      "star",
      "moon",
      "bat",
      "spider",
      "sparkle",
    ];
    const arr: Decor[] = [];
    for (let i = 0; i < 22; i++) {
      arr.push({
        kind: kinds[Math.floor(rng() * kinds.length)],
        left: rng() * 100,
        top: rng() * 100,
        size: 18 + rng() * 36,
        duration: 6 + rng() * 8,
        delay: rng() * -10,
        hue: HUES[Math.floor(rng() * HUES.length)],
        spin: rng() > 0.7,
      });
    }
    return arr;
  }, []);

  return (
    <div className="atmos-decor" aria-hidden>
      {items.map((d, i) => {
        const anim =
          ["float-a", "float-b", "float-c"][i % 3] +
          (d.spin ? ", spin-slow" : "");
        return (
          <div
            key={i}
            className="absolute opacity-50"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              animation: `${anim} ${d.duration}s ease-in-out infinite`,
              animationDelay: `${d.delay}s, 0s`,
              animationDuration: d.spin
                ? `${d.duration}s, ${d.duration * 4}s`
                : `${d.duration}s`,
              animationTimingFunction: d.spin
                ? "ease-in-out, linear"
                : "ease-in-out",
              animationIterationCount: "infinite",
            }}
          >
            <DecorSvg kind={d.kind} hue={d.hue} />
          </div>
        );
      })}
      {/* sparkly stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const rng = pseudoRandom(i + 100);
        const left = rng() * 100;
        const top = rng() * 100;
        const size = 3 + rng() * 4;
        const dur = 2 + rng() * 4;
        const delay = rng() * -6;
        return (
          <div
            key={`s-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: "var(--candy-yellow)",
              boxShadow: "0 0 8px var(--candy-yellow)",
              animation: `twinkle ${dur}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function DecorSvg({ kind, hue }: { kind: Decor["kind"]; hue: string }) {
  const s = "100%";
  switch (kind) {
    case "candy":
      // candy corn: tri-band triangle
      return (
        <svg viewBox="0 0 24 24" width={s} height={s}>
          <path
            d="M12 2 L7 22 L17 22 Z"
            fill="var(--candy-yellow)"
            stroke="var(--ink)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 12 L14.8 12 L17 22 L7 22 Z"
            fill="var(--cream)"
          />
          <path
            d="M9.7 14 L14.3 14 L17 22 L7 22 Z"
            fill="var(--candy-orange)"
            stroke="var(--ink)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s}>
          <path
            d="M12 2 L14.5 9 L22 9.5 L16 14 L18 21.5 L12 17.5 L6 21.5 L8 14 L2 9.5 L9.5 9 Z"
            fill={hue}
            stroke="var(--ink)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s}>
          <path
            d="M16 4 A 9 9 0 1 0 20 18 A 7 7 0 1 1 16 4 Z"
            fill="var(--candy-yellow)"
            stroke="var(--ink)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bat":
      return (
        <svg viewBox="0 0 32 24" width={s} height={s}>
          <path
            d="M16 8 Q 12 4 8 6 Q 4 4 2 8 Q 4 12 8 12 L 8 14 Q 12 12 14 14 Q 14 16 13 17 L 16 16 L 19 17 Q 18 16 18 14 Q 20 12 24 14 L 24 12 Q 28 12 30 8 Q 28 4 24 6 Q 20 4 16 8 Z"
            fill="var(--ink)"
            stroke="var(--ink)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="10" r="0.8" fill={hue} />
          <circle cx="18" cy="10" r="0.8" fill={hue} />
        </svg>
      );
    case "spider":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s}>
          {/* legs */}
          {[
            "M 4 6 L 8 10",
            "M 2 12 L 8 12",
            "M 4 18 L 8 14",
            "M 20 6 L 16 10",
            "M 22 12 L 16 12",
            "M 20 18 L 16 14",
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="var(--ink)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="var(--ink)"
            stroke="var(--ink)"
          />
          <circle cx="10.5" cy="11" r="0.9" fill={hue} />
          <circle cx="13.5" cy="11" r="0.9" fill={hue} />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s}>
          <path
            d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z"
            fill={hue}
            stroke="var(--ink)"
            strokeWidth="0.8"
          />
        </svg>
      );
  }
}
