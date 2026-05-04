"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";

type Color = "orange" | "purple" | "mint" | "pink";

type Props = Omit<HTMLMotionProps<"button">, "color" | "children"> & {
  color?: Color;
  children: ReactNode;
};

const COLORS: Record<Color, { bg: string; bgHi: string; shadow: string }> = {
  orange: {
    bg: "var(--candy-orange)",
    bgHi: "var(--candy-orange-bright)",
    shadow: "#cc5d1c",
  },
  purple: {
    bg: "var(--candy-purple)",
    bgHi: "var(--candy-purple-bright)",
    shadow: "#8a64cc",
  },
  mint: {
    bg: "var(--candy-mint)",
    bgHi: "#a4eed9",
    shadow: "#4eb293",
  },
  pink: {
    bg: "var(--candy-pink)",
    bgHi: "var(--candy-pink-bright)",
    shadow: "#cc7d92",
  },
};

/**
 * Chunky candy-coated button with a hard offset shadow — when pressed, the
 * shadow collapses and the button "depresses" into the page. The brand's
 * primary CTA.
 */
export const CandyButton = forwardRef<HTMLButtonElement, Props>(function CandyButton(
  { children, color = "orange", className = "", ...rest },
  ref,
) {
  const c = COLORS[color];
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -2 }}
      whileTap={{ y: 6 }}
      transition={{ type: "spring", stiffness: 600, damping: 25 }}
      className={`relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display font-semibold text-lg tracking-wide cursor-pointer select-none ${className}`}
      style={{
        background: `linear-gradient(180deg, ${c.bgHi} 0%, ${c.bg} 100%)`,
        color: "var(--ink)",
        boxShadow: `0 6px 0 ${c.shadow}, 0 8px 16px rgba(21, 9, 36, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)`,
        border: "3px solid var(--ink)",
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
});
