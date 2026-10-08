import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoFormatSpec } from "../config/formats";
import { dandelaColors } from "../theme/colors";

type LogoRevealProps = {
  logoSrc: string;
  brandName: string;
  locationLine?: string;
  format: VideoFormatSpec;
  variant?: "mark" | "full";
  placement?: "center" | "upper";
};

export const LogoReveal: React.FC<LogoRevealProps> = ({
  logoSrc,
  brandName,
  locationLine,
  format,
  variant = "full",
  placement = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const scale = interpolate(reveal, [0, 1], [0.82, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoWidth =
    variant === "mark"
      ? 160 * format.textScale
      : (format.id === "horizontal" ? 420 : 520) * format.textScale;

  return (
    <AbsoluteFill
      style={{
        justifyContent: placement === "upper" ? "flex-start" : "center",
        alignItems: "center",
        paddingTop: placement === "upper" ? format.safePaddingY * 0.6 : 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          padding: format.safePaddingX,
        }}
      >
        <Img
          src={staticFile(logoSrc)}
          alt={brandName}
          style={{
            width: logoWidth,
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.45))",
          }}
        />
        {locationLine ? (
          <div
            style={{
              marginTop: 28 * format.textScale,
              fontSize: 26 * format.textScale,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: dandelaColors.goldMuted,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {locationLine}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
