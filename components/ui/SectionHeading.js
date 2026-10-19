"use client";

import { Stack, Typography } from "@mui/material";
import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  kicker,
  title,
  subtitle,
  align = "left",
  maxWidth = 720,
  sx,
}) {
  const centered = align === "center";
  return (
    <Reveal>
      <Stack
        spacing={1.5}
        sx={{
          maxWidth,
          mx: centered ? "auto" : 0,
          textAlign: centered ? "center" : "left",
          alignItems: centered ? "center" : "flex-start",
          ...sx,
        }}
      >
        {kicker || index ? (
          <Typography
            variant="overline"
            sx={{ color: "var(--primary)", lineHeight: 1 }}
          >
            {index ? `${index}  /  ` : ""}
            {kicker}
          </Typography>
        ) : null}
        <Typography
          variant="h2"
          component="h2"
          sx={{ fontSize: { xs: "2.25rem", sm: "2.9rem", md: "3.6rem" } }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            sx={{
              color: "var(--text-muted)",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </Reveal>
  );
}
