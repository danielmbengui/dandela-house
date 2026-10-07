"use client";

import Image from "next/image";

const LOGOS = {
  full: {
    src: "/images/logo-full-dark.png",
    width: 490,
    height: 509,
  },
  mark: {
    src: "/images/logo-mark-dark.png",
    width: 557,
    height: 448,
  },
};

export default function BrandLogo({ variant = "full", height = 56 }) {
  const logo = LOGOS[variant] ?? LOGOS.full;

  return (
    <Image
      src={logo.src}
      alt="DANDELA House"
      width={logo.width}
      height={logo.height}
      priority
      style={{ width: "auto", height, objectFit: "contain" }}
    />
  );
}
