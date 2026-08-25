"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { HeroSlide } from "@/types/domain";
import { mediaUrl } from "@/lib/media";

interface HeroShowcaseProps {
  slides: HeroSlide[];
}

/**
 * Each composition arranges the same two media slots (portrait / artwork) and
 * text differently — this is what keeps the rotation feeling art-directed
 * rather than "swap one image for another."
 */
function SlideComposition({ slide, reduceMotion }: { slide: HeroSlide; reduceMotion: boolean }) {
  const primary = mediaUrl(slide.primary_media);
  const secondary = mediaUrl(slide.secondary_media);

  const frame = { hidden: { opacity: 0 }, show: { opacity: 1 } };
  const easing = [0.16, 1, 0.3, 1] as const;

  switch (slide.composition) {
    case "full_impact_showcase":
      return (
        <div className="relative h-full w-full">
          {secondary && (
            <Image src={secondary} alt="" fill priority className="object-cover" sizes="100vw" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-public-black/70 via-public-black/10 to-transparent" />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            className="absolute inset-x-4 bottom-8 sm:inset-x-6 sm:bottom-12 sm:max-w-xl lg:left-12 lg:right-auto"
          >
            {slide.headline && (
              <h2 className="font-display text-2xl font-medium leading-[1.1] text-public-white sm:text-4xl lg:text-6xl">
                {slide.headline}
              </h2>
            )}
          </motion.div>
        </div>
      );

    case "portrait_beside_design":
      return (
        <div className="flex h-full w-full flex-col sm:flex-row">
          <div className="relative h-1/2 w-full sm:h-full sm:w-1/2">
            {primary && (
              <Image
                src={primary}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="relative h-1/2 w-full bg-public-ivory sm:h-full sm:w-1/2">
            {secondary && (
              <Image
                src={secondary}
                alt=""
                fill
                priority
                className="object-contain p-6 sm:p-10"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            )}
          </div>
          {slide.headline && (
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: easing }}
              className="absolute inset-x-4 bottom-4 rounded-sm bg-public-ivory/90 px-3 py-2 font-display text-xl font-medium text-public-black backdrop-blur-sm sm:inset-x-auto sm:bottom-10 sm:left-6 sm:max-w-md sm:bg-transparent sm:px-0 sm:py-0 sm:text-3xl sm:backdrop-blur-0 lg:text-5xl"
            >
              {slide.headline}
            </motion.h2>
          )}
        </div>
      );

    case "portrait_typography_branding":
      return (
        <div className="flex h-full w-full flex-col bg-public-black sm:flex-row sm:items-center sm:justify-center">
          {primary && (
            <div className="relative h-1/2 w-full sm:h-full sm:w-1/2">
              <Image
                src={primary}
                alt=""
                fill
                priority
                className="object-cover opacity-90"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          )}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: easing }}
            className="flex h-1/2 w-full flex-col items-start justify-center px-6 py-4 sm:h-full sm:w-1/2 sm:px-8 lg:px-14"
          >
            {slide.headline && (
              <h2 className="font-display text-2xl italic leading-tight text-public-white sm:text-4xl lg:text-6xl">
                {slide.headline}
              </h2>
            )}
            {slide.subtext && (
              <p className="mt-3 max-w-sm font-body text-sm text-public-white/70 sm:mt-4 sm:text-base">
                {slide.subtext}
              </p>
            )}
          </motion.div>
        </div>
      );

    case "editorial":
      return (
        <div className="relative h-full w-full bg-public-ivory">
          <div className="grid h-full grid-cols-12 gap-4 px-6 py-10 lg:px-12">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing }}
              className="col-span-12 flex flex-col justify-center lg:col-span-5"
            >
              {slide.headline && (
                <h2 className="font-display text-4xl font-medium leading-[1.05] text-public-black lg:text-5xl">
                  {slide.headline}
                </h2>
              )}
              {slide.subtext && (
                <p className="mt-5 font-body text-public-black/70">{slide.subtext}</p>
              )}
            </motion.div>
            <div className="relative col-span-12 h-56 overflow-hidden rounded-sm sm:h-72 lg:col-span-7 lg:h-full">
              {secondary && (
                <Image
                  src={secondary}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}
            </div>
          </div>
        </div>
      );

    case "portrait_with_artwork":
    default:
      return (
        <div className="relative h-full w-full bg-public-ivory">
          {primary && (
            <div className="absolute inset-y-0 right-0 w-3/5">
              <Image src={primary} alt="" fill priority className="object-cover" sizes="60vw" />
            </div>
          )}
          {secondary && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 0.8, ease: easing, delay: 0.15 }}
              className="absolute bottom-10 left-8 h-56 w-40 overflow-hidden rounded-sm shadow-2xl lg:h-72 lg:w-56"
            >
              <Image src={secondary} alt="" fill className="object-cover" sizes="20vw" />
            </motion.div>
          )}
          {slide.headline && (
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing }}
              className="absolute inset-x-4 top-6 sm:inset-x-8 sm:top-12 sm:max-w-sm font-display text-2xl font-medium leading-[1.1] text-public-black sm:text-4xl lg:text-5xl"
            >
              {slide.headline}
            </motion.h2>
          )}
        </div>
      );
  }
}

export function HeroShowcase({ slides }: HeroShowcaseProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = slides[index];

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  // Preload the next slide's media so transitions never pop.
  useEffect(() => {
    const next = slides[(index + 1) % slides.length];
    [next?.primary_media, next?.secondary_media].forEach((m) => {
      const url = mediaUrl(m);
      if (url) {
        const img = new window.Image();
        img.src = url;
      }
    });
  }, [index, slides]);

  useEffect(() => {
    if (paused || reduceMotion || slides.length <= 1) return;
    timerRef.current = setTimeout(() => goTo(index + 1), active?.duration_ms ?? 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, reduceMotion, slides.length, active, goTo]);

  if (!slides.length) return null;

  return (
    <section
      className="relative h-[78vh] min-h-[420px] w-full overflow-hidden sm:min-h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured work showcase"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <SlideComposition slide={active} reduceMotion={!!reduceMotion} />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 z-10 flex w-[92%] max-w-full -translate-x-1/2 flex-wrap items-center justify-center gap-3 sm:bottom-6 sm:w-auto sm:gap-4">
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="shrink-0 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="relative h-1.5 w-6 shrink-0 overflow-hidden rounded-full bg-black/20 sm:w-8"
            >
              {i === index && (
                <motion.div
                  key={active.id}
                  className="absolute inset-y-0 left-0 bg-black"
                  initial={{ width: "0%" }}
                  animate={{ width: paused || reduceMotion ? "100%" : "100%" }}
                  transition={{ duration: reduceMotion ? 0 : active.duration_ms / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="shrink-0 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* CTAs sit above the composition, consistent position across all compositions */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        <Link
          href="/portfolio"
          className="rounded-full bg-public-black px-5 py-2.5 text-center font-body text-sm font-medium text-public-white transition-colors hover:bg-public-violet"
        >
          View My Work
        </Link>
        <Link
          href="/start-a-project"
          className="rounded-full border border-public-black bg-transparent px-5 py-2.5 text-center font-body text-sm font-medium text-public-black transition-colors hover:bg-public-black hover:text-public-white"
        >
          Start a Project
        </Link>
      </div>
    </section>
  );
}
