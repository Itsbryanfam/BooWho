"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type BooMood =
  | "idle"      // gentle bob, occasional blink
  | "curious"   // tilts head, eyes look at upload
  | "excited"   // big smile, bouncing
  | "thinking" // eyes closed, slight head tilt, thought bubble vibe
  | "wow"       // O-mouth, big eyes
  | "happy";    // closed-eye smile

type Props = {
  mood?: BooMood;
  size?: number;
  className?: string;
};

/**
 * Boo — the friendly ghost mascot. Built from inline SVG + motion so we can
 * animate eyes, mouth, body sway, and hand wave independently.
 */
export function Boo({ mood = "idle", size = 96, className = "" }: Props) {
  const bodyControls = useAnimationControls();

  // Idle bob — runs in all moods, stronger in `excited`.
  useEffect(() => {
    const amplitude =
      mood === "excited" ? -14 : mood === "wow" ? -2 : mood === "thinking" ? -3 : -8;
    bodyControls.start({
      y: [0, amplitude, 0],
      transition: {
        duration: mood === "excited" ? 0.8 : 3.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [mood, bodyControls]);

  return (
    <motion.svg
      animate={bodyControls}
      viewBox="0 0 120 140"
      width={size}
      height={(size * 140) / 120}
      className={`sticker-shadow overflow-visible ${className}`}
      aria-hidden
    >
      <BooBody mood={mood} />
    </motion.svg>
  );
}

function BooBody({ mood }: { mood: BooMood }) {
  return (
    <>
      {/* Body — rounded blob with wavy bottom */}
      <motion.path
        d="
          M 60 8
          C 36 8 22 26 22 50
          L 22 110
          Q 28 124 38 114
          Q 48 104 60 114
          Q 72 124 82 114
          Q 92 104 98 110
          L 98 50
          C 98 26 84 8 60 8
          Z
        "
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
        animate={
          mood === "thinking" ? { rotate: [-3, 3, -3] } : { rotate: 0 }
        }
        transition={{
          duration: 2.4,
          repeat: mood === "thinking" ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "60px 60px" }}
      />

      {/* Cheeks */}
      <ellipse cx="36" cy="68" rx="5" ry="3.5" fill="var(--candy-pink)" opacity="0.85" />
      <ellipse cx="84" cy="68" rx="5" ry="3.5" fill="var(--candy-pink)" opacity="0.85" />

      <Eyes mood={mood} />
      <Mouth mood={mood} />

      {mood === "thinking" && <ThoughtBubble />}
      {mood === "wow" && <Sparkles />}
    </>
  );
}

function Eyes({ mood }: { mood: BooMood }) {
  // Blinking
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    const t = setInterval(
      () => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 130);
      },
      2800 + Math.random() * 2500,
    );
    return () => clearInterval(t);
  }, []);

  if (mood === "thinking" || mood === "happy") {
    // closed/squinting
    return (
      <>
        <path
          d="M 38 50 Q 45 46 52 50"
          stroke="var(--ink)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 68 50 Q 75 46 82 50"
          stroke="var(--ink)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }

  const big = mood === "wow" || mood === "excited";
  const ry = blinking ? 1 : big ? 9 : 7;
  const rx = blinking ? 6 : big ? 7 : 5.5;

  // pupil offset for "curious"
  const pupilDx = mood === "curious" ? 1.2 : 0;
  const pupilDy = mood === "curious" ? -1 : 0;

  return (
    <>
      <motion.ellipse
        cx="45"
        cy="52"
        animate={{ rx, ry }}
        transition={{ duration: 0.12 }}
        fill="var(--ink)"
      />
      <motion.ellipse
        cx="75"
        cy="52"
        animate={{ rx, ry }}
        transition={{ duration: 0.12 }}
        fill="var(--ink)"
      />
      {!blinking && (
        <>
          <circle
            cx={46.5 + pupilDx}
            cy={50 + pupilDy}
            r="1.4"
            fill="var(--cream)"
          />
          <circle
            cx={76.5 + pupilDx}
            cy={50 + pupilDy}
            r="1.4"
            fill="var(--cream)"
          />
        </>
      )}
    </>
  );
}

function Mouth({ mood }: { mood: BooMood }) {
  // Animate the mouth path between moods
  const path =
    mood === "wow"
      ? "M 60 78 m -7 0 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0"
      : mood === "excited" || mood === "happy"
        ? "M 50 76 Q 60 88 70 76"
        : mood === "thinking"
          ? "M 54 78 Q 60 80 66 78"
          : mood === "curious"
            ? "M 54 78 Q 60 82 66 78"
            : "M 54 78 Q 60 81 66 78"; // idle

  const fill = mood === "wow" ? "var(--ink)" : "none";

  return (
    <motion.path
      d={path}
      fill={fill}
      stroke="var(--ink)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ d: path }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    />
  );
}

function ThoughtBubble() {
  return (
    <g>
      <motion.circle
        cx="100"
        cy="22"
        r="9"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="2.5"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 22px" }}
      />
      <circle
        cx="92"
        cy="34"
        r="4"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <circle
        cx="86"
        cy="42"
        r="2.5"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
    </g>
  );
}

function Sparkles() {
  return (
    <g>
      {[
        { x: 16, y: 30, size: 6 },
        { x: 100, y: 36, size: 5 },
        { x: 14, y: 90, size: 4 },
        { x: 104, y: 90, size: 4 },
      ].map((s, i) => (
        <motion.path
          key={i}
          d={`M ${s.x} ${s.y - s.size} L ${s.x + s.size * 0.3} ${s.y - s.size * 0.3} L ${s.x + s.size} ${s.y} L ${s.x + s.size * 0.3} ${s.y + s.size * 0.3} L ${s.x} ${s.y + s.size} L ${s.x - s.size * 0.3} ${s.y + s.size * 0.3} L ${s.x - s.size} ${s.y} L ${s.x - s.size * 0.3} ${s.y - s.size * 0.3} Z`}
          fill="var(--candy-yellow)"
          stroke="var(--ink)"
          strokeWidth="1.5"
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        />
      ))}
    </g>
  );
}

/**
 * Wraps Boo in a cycle that alternates moods on a timer — used during loading.
 */
export function BooLoading({ size = 120 }: { size?: number }) {
  const moods: BooMood[] = ["thinking", "curious", "thinking", "wow"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % moods.length), 2400);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Boo mood={moods[idx]} size={size} />;
}

/**
 * Tiny wordmark-sized ghost that lives next to the BooWho logo.
 */
export function BooMark({
  mood = "idle",
  size = 56,
}: {
  mood?: BooMood;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="inline-block">
      <Boo mood={mood} size={size} />
    </div>
  );
}
