"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CostumeCard } from "./CostumeCard";
import { CandyButton } from "./CandyButton";
import { BooMark } from "./Boo";
import type { EnrichedSuggestion } from "@/lib/gemini";

type Props = {
  suggestions: EnrichedSuggestion[];
};

const ROTATIONS = [-2.4, 1.8, -1.5, 2.2, -2.8, 1.4];

export function CostumeStack({ suggestions }: Props) {
  const router = useRouter();
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <BooMark mood="happy" size={48} />
          <span className="font-display font-bold text-3xl text-cream">
            BooWho?
          </span>
        </Link>
        <h1 className="mt-6 font-display font-bold text-4xl md:text-5xl text-cream leading-tight">
          Boo says you should be…
        </h1>
        <p className="mt-3 font-display text-cream/75 text-lg">
          {suggestions.length === 4
            ? "All four of these would look great. Pick your fave."
            : `Boo found ${suggestions.length} ${suggestions.length === 1 ? "match" : "matches"} that suit you.`}
        </p>
      </motion.header>

      <div className="grid gap-10 md:gap-12 sm:grid-cols-2 max-w-3xl mx-auto">
        {suggestions.map((s, idx) => (
          <CostumeCard
            key={idx}
            s={s}
            index={idx}
            rotation={ROTATIONS[idx % ROTATIONS.length]}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + suggestions.length * 0.12, duration: 0.5 }}
        className="mt-16 flex justify-center"
      >
        <CandyButton color="purple" onClick={() => router.push("/")}>
          Try another photo →
        </CandyButton>
      </motion.div>
    </>
  );
}
