"use client";

import { Box } from "@mui/material";

/** Carte « verre dépoli » : fond translucide, bordure fine, flou d'arrière-plan. */
export default function GlassCard({ children, sx, strong = false, ...props }) {
  return (
    <Box
      {...props}
      sx={{
        position: "relative",
        borderRadius: 5,
        border: "1px solid var(--border)",
        bgcolor: strong ? "var(--surface-strong)" : "var(--surface)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: "var(--shadow-soft)",
        transition:
          "transform 400ms cubic-bezier(.22,1,.36,1), border-color 300ms ease, box-shadow 400ms ease",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
