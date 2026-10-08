import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoFormatSpec } from "../config/formats";
import { dandelaColors } from "../theme/colors";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Outfit";

const { fontFamily: serif } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

const { fontFamily: sans } = loadSans("normal", {
  weights: ["300", "500"],
  subsets: ["latin"],
});

type CinematicTextProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  format: VideoFormatSpec;
  align?: "bottom" | "center";
};

export const CinematicText: React.FC<CinematicTextProps> = ({
  kicker,
  title,
  subtitle,
  format,
  align = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = format.textScale;

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(enter, [0, 1], [28, 0]);

  if (!kicker && !title && !subtitle) {
    return null;
  }

  const paddingBottom =
    align === "bottom" ? format.safePaddingY : format.height * 0.08;

  return (
    <AbsoluteFill
      style={{
        justifyContent: align === "bottom" ? "flex-end" : "center",
        paddingLeft: format.safePaddingX,
        paddingRight: format.safePaddingX,
        paddingBottom,
        paddingTop: format.safePaddingY,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: format.id === "horizontal" ? "52%" : "100%",
        }}
      >
        {kicker ? (
          <div
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 28 * scale,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: dandelaColors.gold,
              marginBottom: 12 * scale,
            }}
          >
            {kicker}
          </div>
        ) : null}
        {title ? (
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: (format.id === "square" ? 72 : 84) * scale,
              lineHeight: 1.05,
              color: dandelaColors.cream,
              textShadow: `0 8px 32px ${dandelaColors.forestDeep}`,
            }}
          >
            {title}
          </div>
        ) : null}
        {subtitle ? (
          <div
            style={{
              fontFamily: sans,
              fontWeight: 300,
              fontSize: 34 * scale,
              lineHeight: 1.35,
              color: dandelaColors.creamLight,
              marginTop: 16 * scale,
              maxWidth: format.id === "horizontal" ? 640 : 900,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
