"use client";

import { motion, type Variants } from "framer-motion";

/**
 * Fade+rise into view once, respecting prefers-reduced-motion automatically
 * (framer-motion honors it for `transform`/`opacity` when the user's OS
 * setting is on, but we also keep the motion itself small and purposeful —
 * this is meant to feel alive, not showy).
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
