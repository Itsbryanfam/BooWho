"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { EnrichedSuggestion } from "@/lib/gemini";

const CATEGORY_LABEL: Record<EnrichedSuggestion["category"], string> = {
  celebrity: "celeb",
  fiction: "fiction",
  historical: "history",
  archetype: "vibe",
};

const CATEGORY_BG: Record<EnrichedSuggestion["category"], string> = {
  celebrity: "var(--cat-celebrity)",
  fiction: "var(--cat-fiction)",
  historical: "var(--cat-historical)",
  archetype: "var(--cat-archetype)",
};

type Props = {
  s: EnrichedSuggestion;
  index: number;
  rotation: number;
};

export function CostumeCard({ s, index, rotation }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.85, rotate: rotation * 3 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
      transition={{
        delay: 0.2 + index * 0.12,
        type: "spring",
        stiffness: 180,
        damping: 16,
      }}
      whileHover={{
        rotate: 0,
        y: -8,
        scale: 1.04,
        transition: { type: "spring", stiffness: 320, damping: 18 },
      }}
      style={{ transformOrigin: "50% 60%" }}
      className="relative will-change-transform"
    >
      <div
        className="paper rounded-[24px] overflow-hidden"
        style={{
          border: "4px solid var(--ink)",
          boxShadow:
            "0 8px 0 var(--ink), 0 12px 28px rgba(21, 9, 36, 0.45)",
        }}
      >
        {/* image */}
        <div className="relative aspect-[4/5] bg-plum-soft">
          {s.imageUrl && (
            <Image
              src={s.imageUrl}
              alt={s.name}
              fill
              sizes="(min-width: 768px) 33vw, 80vw"
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        {/* name strip */}
        <div className="px-4 py-3 border-t-[4px] border-ink bg-cream">
          <h3 className="font-display font-semibold text-ink text-xl leading-tight">
            {s.name}
          </h3>
        </div>

        {/* note */}
        <div className="px-4 py-3 border-t-[3px] border-ink/70" style={{ background: CATEGORY_BG[s.category] }}>
          <p className="font-display text-ink text-[15px] leading-snug">
            {s.reasoning}
          </p>
          {s.pageUrl && (
            <a
              href={s.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs font-display font-semibold text-ink/70 hover:text-ink underline decoration-2 underline-offset-4"
            >
              read on Wikipedia ↗
            </a>
          )}
        </div>
      </div>

      {/* category sticker */}
      <CategorySticker category={s.category} rotation={-rotation * 2} />
    </motion.article>
  );
}

function CategorySticker({
  category,
  rotation,
}: {
  category: EnrichedSuggestion["category"];
  rotation: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: rotation - 30 }}
      animate={{ scale: 1, rotate: rotation }}
      transition={{ delay: 0.5, type: "spring", stiffness: 320, damping: 18 }}
      className="absolute -top-4 -right-4 sticker-shadow-sm"
    >
      <div
        className="grid place-items-center w-20 h-20 rounded-full font-display font-bold text-ink text-sm uppercase tracking-wide"
        style={{
          background: CATEGORY_BG[category],
          border: "3px solid var(--ink)",
        }}
      >
        <span className="text-center px-1 leading-none">
          {CATEGORY_LABEL[category]}
        </span>
      </div>
    </motion.div>
  );
}
