"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  glow?: boolean;
  className?: string;
};

/**
 * Playful chunky photo frame with thick black outline and a candy-stripe rim.
 * Wiggles on drag-over.
 */
export function PhotoFrame({ children, glow = false, className = "" }: Props) {
  return (
    <motion.div
      animate={
        glow
          ? { rotate: [-1.4, 1.4, -1.4], scale: 1.02 }
          : { rotate: 0, scale: 1 }
      }
      transition={
        glow
          ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.4, ease: "easeOut" }
      }
      className={`relative ${className}`}
    >
      {/* outer chunky frame */}
      <div
        className="relative rounded-[28px] p-3"
        style={{
          background:
            "linear-gradient(135deg, var(--candy-orange) 0%, var(--candy-pink) 50%, var(--candy-purple) 100%)",
          border: "4px solid var(--ink)",
          boxShadow: glow
            ? "0 10px 0 var(--ink), 0 14px 40px rgba(255, 138, 60, 0.5)"
            : "0 10px 0 var(--ink), 0 14px 30px rgba(21, 9, 36, 0.5)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* photo well */}
        <div
          className="relative rounded-[18px] overflow-hidden"
          style={{
            background: "var(--cream)",
            border: "3px solid var(--ink)",
          }}
        >
          {children}
        </div>
        {/* corner sticker — a small star */}
        <div
          className="absolute -top-4 -left-4 w-12 h-12 sticker-shadow-sm"
          style={{ transform: "rotate(-12deg)" }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden>
            <path
              d="M12 2 L14.5 9 L22 9.5 L16 14 L18 21.5 L12 17.5 L6 21.5 L8 14 L2 9.5 L9.5 9 Z"
              fill="var(--candy-yellow)"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* tape strip */}
        <div
          className="absolute -top-3 right-8 w-16 h-5 rotate-6 opacity-80"
          style={{
            background: "var(--candy-mint)",
            border: "2px solid var(--ink)",
            boxShadow: "0 2px 0 rgba(21,9,36,0.3)",
          }}
        />
      </div>
    </motion.div>
  );
}
