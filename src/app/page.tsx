"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { analyzeSelfie, type AnalyzeResult } from "./actions/analyze";
import { PhotoFrame } from "@/components/PhotoFrame";
import { CandyButton } from "@/components/CandyButton";
import { BooLoading, BooMark, type BooMood } from "@/components/Boo";

const TAGLINES = [
  "Hmm, let me think…",
  "Ooh, I’ve got ideas!",
  "Almost got it…",
  "One sec — squinting really hard…",
  "I think I see it!",
];

const MAX_EDGE = 1024;
const JPEG_QUALITY = 0.85;

async function resizeToBase64Jpeg(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Could not decode image"));
    i.src = dataUrl;
  });

  const longEdge = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = longEdge > MAX_EDGE ? MAX_EDGE / longEdge : 1;
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

const ERROR_MESSAGES: Record<
  Exclude<AnalyzeResult, { ok: true }>["error"],
  string
> = {
  no_face: "Hmm, Boo couldn't see a face in there. Try another photo?",
  too_large: "That photo is too big. Try a smaller one!",
  rate_limited: "Boo's a little dizzy from all the requests. Try again in a bit.",
  blocked: "Boo couldn't read that image. Got another?",
  unknown: "Something went sideways. Try again?",
};

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busy) return;
    const intervalId = setInterval(
      () => setTagIdx((i) => (i + 1) % TAGLINES.length),
      2400,
    );
    return () => clearInterval(intervalId);
  }, [busy]);

  const mood: BooMood = busy
    ? "thinking"
    : preview
      ? "wow"
      : dragging
        ? "excited"
        : hovering
          ? "curious"
          : "idle";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Hmm, that doesn't look like an image.");
      return;
    }

    setBusy(true);
    try {
      const base64 = await resizeToBase64Jpeg(file);
      setPreview(base64);

      const result = await analyzeSelfie(base64);
      if (result.ok) {
        router.push(`/r/${result.shortId}`);
        return;
      }
      setError(ERROR_MESSAGES[result.error]);
      setBusy(false);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("That image wouldn't load. Got another?");
      setBusy(false);
      setPreview(null);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Wordmark + mascot */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3">
            <BooMark mood={mood} size={68} />
            <h1 className="font-display font-bold text-cream leading-none text-6xl md:text-7xl">
              Boo<span className="text-candy-orange">Who</span>
              <span className="text-candy-purple">?</span>
            </h1>
          </div>
          <p className="mt-5 font-display text-cream/80 text-lg max-w-sm mx-auto">
            Drop a selfie. Boo&rsquo;ll figure out who you should be for Halloween.
          </p>
        </motion.header>

        {/* Speech bubble — Boo reacts to state */}
        <AnimatePresence mode="wait">
          {!busy && (
            <motion.div
              key={mood}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-4"
            >
              <SpeechBubble>
                {mood === "wow"
                  ? "Ooh nice — let me look!"
                  : mood === "excited"
                    ? "Yes! Drop it!"
                    : mood === "curious"
                      ? "What've you got?"
                      : "Got a selfie for me?"}
              </SpeechBubble>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 200, damping: 18 }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (busy) return;
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <PhotoFrame glow={dragging}>
            <div className="relative aspect-[4/5]">
              <AnimatePresence mode="popLayout">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Your photo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {busy && <ScanSweep />}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-cream"
                  >
                    <CutePlaceholder dragging={dragging} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PhotoFrame>
        </motion.div>

        {/* Below frame — button or loading */}
        <div className="mt-10 min-h-[10rem] flex flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            {busy ? (
              <motion.div
                key="busy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <BooLoading size={120} />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tagIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="font-display font-medium text-cream text-lg"
                  >
                    {TAGLINES[tagIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-3"
              >
                <CandyButton
                  color="orange"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📸 Pick a photo
                </CandyButton>
                <p className="text-sm font-display text-cream/60">
                  or drag &amp; drop one
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
          disabled={busy}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="mt-6 mx-auto max-w-sm rounded-2xl px-4 py-3 text-center font-display text-ink"
              style={{
                background: "var(--candy-pink-bright)",
                border: "3px solid var(--ink)",
                boxShadow: "0 4px 0 var(--ink)",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-12 text-center text-xs font-display text-cream/40">
          Photos are checked then forgotten — never stored.
        </p>
      </div>
    </main>
  );
}

function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <div
        className="px-4 py-2 rounded-2xl font-display font-medium text-ink text-base"
        style={{
          background: "var(--cream)",
          border: "3px solid var(--ink)",
          boxShadow: "0 3px 0 var(--ink)",
        }}
      >
        {children}
      </div>
      <svg
        viewBox="0 0 20 14"
        className="absolute left-1/2 -translate-x-1/2 -bottom-[12px] w-5 h-3.5"
        aria-hidden
      >
        <path
          d="M 2 0 L 18 0 L 10 14 Z"
          fill="var(--cream)"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CutePlaceholder({ dragging }: { dragging: boolean }) {
  return (
    <div className="text-center">
      <motion.div
        animate={dragging ? { scale: [1, 1.15, 1], rotate: [-5, 5, -5] } : { scale: 1, rotate: 0 }}
        transition={dragging ? { duration: 0.6, repeat: Infinity } : { duration: 0.3 }}
        className="text-7xl mb-2"
      >
        📷
      </motion.div>
      <p className="font-script text-2xl text-ink/70">
        {dragging ? "drop it!" : "your photo here"}
      </p>
    </div>
  );
}

function ScanSweep() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      initial={{ y: "-100%" }}
      animate={{ y: "100%" }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(255, 138, 60, 0.4) 45%, rgba(255, 217, 107, 0.6) 50%, rgba(201, 163, 255, 0.4) 55%, transparent 100%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
