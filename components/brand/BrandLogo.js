"use client";

import Image from "next/image";

const LOGOS = {
  full: {
    light: "/images/logo-full-dark.png",
    dark: "/images/logo-full-cream.png",
    width: 490,
    height: 509,
  },
  mark: {
    light: "/images/logo-mark-dark.png",
    dark: "/images/logo-mark-cream.png",
    width: 557,
    height: 448,
  },
  markGold: {
    light: "/images/logo-mark-gold.png",
    dark: "/images/logo-mark-gold.png",
    width: 557,
    height: 448,
  },
};

/**
 * Logo DANDELA House.
 * - `variant` : "full" | "mark" | "markGold"
 * - `tone` : "auto" (suit le thème via CSS, sans flash), "light" (bordeaux) ou "dark" (crème)
 */
export default function BrandLogo({
  variant = "full",
  height = 56,
  tone = "auto",
  priority = false,
}) {
  const logo = LOGOS[variant] ?? LOGOS.full;
  const style = { width: "auto", height, objectFit: "contain" };

  if (tone !== "auto") {
    return (
      <Image
        src={tone === "dark" ? logo.dark : logo.light}
        alt="DANDELA House"
        width={logo.width}
        height={logo.height}
        priority={priority}
        style={style}
      />
    );
  }

  return (
    <>
      <Image
        className="logo-light"
        src={logo.light}
        alt="DANDELA House"
        width={logo.width}
        height={logo.height}
        priority={priority}
        style={style}
      />
      <Image
        className="logo-dark"
        src={logo.dark}
        alt=""
        aria-hidden
        width={logo.width}
        height={logo.height}
        style={style}
      />
    </>
  );
}
