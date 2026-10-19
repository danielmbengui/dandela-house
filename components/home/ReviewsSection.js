"use client";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlassCard, { cardPadding } from "@/components/ui/GlassCard";

export default function ReviewsSection() {
  const t = useTranslations("home.reviews");
  const items = t.raw("items");

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 14 }, position: "relative" }}>
      <Container maxWidth="lg">
        <SectionHeading index="06" kicker={t("kicker")} title={t("title")} align="center" sx={{ mb: { xs: 5, md: 7 } }} />
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {items.map((review, i) => (
            <Grid key={review.name} size={{ xs: 12, md: 4 }}>
              <Reveal delay={i * 0.1} style={{ height: "100%" }}>
                <GlassCard sx={{ height: "100%", p: cardPadding, display: "flex", flexDirection: "column" }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Stack direction="row" spacing={0.25}>
                      {[0, 1, 2, 3, 4].map((s) => (
                        <StarRoundedIcon key={s} sx={{ fontSize: 18, color: "var(--gold)" }} />
                      ))}
                    </Stack>
                    <FormatQuoteRoundedIcon sx={{ color: "var(--gold-glow)", fontSize: 40, filter: "saturate(2)" }} />
                  </Stack>
                  <Typography
                    className="font-serif"
                    sx={{ fontSize: { xs: "1.25rem", md: "1.35rem" }, lineHeight: 1.5, flex: 1, mb: 3 }}
                  >
                    “{review.text}”
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "var(--primary-glow)",
                        color: "var(--primary)",
                        fontWeight: 600,
                      }}
                    >
                      {review.name.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                        {review.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                        {review.origin}
                      </Typography>
                    </Box>
                  </Stack>
                </GlassCard>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
