"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Apparition douce au scroll (translation + fondu), désactivée si prefers-reduced-motion. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.8,
  once = true,
  amount = 0.25,
  style,
  className,
  as = "div",
}) {
  const reduce = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

export { EASE };
