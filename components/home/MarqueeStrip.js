"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

/** Bandeau défilant, dans l'esprit du marquee PlayPad : capitales + séparateur. */
export default function MarqueeStrip() {
  const t = useTranslations("home.marquee");
  const items = t.raw("items");
  const doubled = [...items, ...items];

  return (
    <Box
      aria-hidden
      sx={{
        mt: { xs: 8, md: 10 },
        py: 2.4,
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        bgcolor: "var(--card-color)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <Box className="marquee-track">
        {doubled.map((label, i) => (
          <Box
            key={`${label}-${i}`}
            sx={{ display: "flex", alignItems: "center", gap: 2.5, pr: 2.5 }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.72rem", md: "0.8rem" },
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: "var(--font-color)",
              }}
            >
              {label}
            </Typography>
            <Box component="span" sx={{ color: "var(--secondary)", fontSize: 14, lineHeight: 1 }}>
              ✳
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
