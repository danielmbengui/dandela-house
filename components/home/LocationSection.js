"use client";

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlassCard, { cardPadding } from "@/components/ui/GlassCard";
import { SITE } from "@/lib/site";

const POINTS = [
  { key: "airport", Icon: FlightTakeoffOutlinedIcon },
  { key: "center", Icon: LocationCityOutlinedIcon },
  { key: "market", Icon: StorefrontOutlinedIcon },
  { key: "hospital", Icon: LocalHospitalOutlinedIcon },
];

/** Repère graphique : cercles concentriques + point doré (pas une carte). */
function Compass() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        aspectRatio: "1",
        width: "100%",
        maxWidth: 420,
        mx: "auto",
        borderRadius: "50%",
        border: "1px solid var(--border)",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at 50% 50%, var(--gold-glow) 0%, transparent 60%)",
      }}
    >
      {[0.74, 0.5, 0.26].map((ratio) => (
        <Box
          key={ratio}
          sx={{
            position: "absolute",
            width: `${ratio * 100}%`,
            height: `${ratio * 100}%`,
            borderRadius: "50%",
            border: "1px dashed var(--border-strong)",
          }}
        />
      ))}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, transparent 0deg, var(--gold-glow) 40deg, transparent 90deg)",
          animation: "spin 14s linear infinite",
          "@keyframes spin": { to: { transform: "rotate(360deg)" } },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />
      <Box
        sx={{
          position: "relative",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "var(--gold)",
          boxShadow: "0 0 0 10px var(--gold-glow), 0 0 40px var(--gold)",
        }}
      />
      <Typography
        className="font-serif"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(18px, -50%)",
          fontSize: "1.3rem",
          fontStyle: "italic",
          color: "var(--text)",
          whiteSpace: "nowrap",
        }}
      >
        Sapu
      </Typography>
      {["N", "E", "S", "W"].map((d, i) => (
        <Typography
          key={d}
          variant="caption"
          sx={{
            position: "absolute",
            color: "var(--text-faint)",
            letterSpacing: "0.2em",
            ...(i === 0 && { top: 10, left: "50%", transform: "translateX(-50%)" }),
            ...(i === 1 && { right: 12, top: "50%", transform: "translateY(-50%)" }),
            ...(i === 2 && { bottom: 10, left: "50%", transform: "translateX(-50%)" }),
            ...(i === 3 && { left: 12, top: "50%", transform: "translateY(-50%)" }),
          }}
        >
          {d}
        </Typography>
      ))}
    </Box>
  );
}

export default function LocationSection() {
  const t = useTranslations("home.location");

  return (
    <Box component="section" id="location" className="section-anchor" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Reveal>
              <Compass />
            </Reveal>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <SectionHeading index="05" kicker={t("kicker")} title={t("title")} subtitle={t("text")} />
            <Reveal delay={0.1}>
              <GlassCard sx={{ mt: 4, p: cardPadding }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start", mb: 2.5 }}>
                  <PlaceOutlinedIcon sx={{ color: "var(--primary)", mt: "2px" }} />
                  <Typography sx={{ lineHeight: 1.6 }}>{t("address")}</Typography>
                </Stack>
                <Grid container spacing={1.5}>
                  {POINTS.map(({ key, Icon }) => (
                    <Grid key={key} size={{ xs: 12, sm: 6 }}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                          alignItems: "center",
                          p: 2.25,
                          borderRadius: 3,
                          bgcolor: "var(--surface)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <Icon sx={{ color: "var(--primary)" }} fontSize="small" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">{t(`points.${key}.label`)}</Typography>
                        </Box>
                        <Typography className="font-serif" sx={{ fontSize: "1.15rem", color: "var(--text)" }}>
                          {t(`points.${key}.value`)}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 2.5, alignItems: { sm: "center" }, justifyContent: "space-between" }}
                >
                  <Typography variant="caption" sx={{ color: "var(--text-faint)" }}>
                    {t("pointsNote")}
                  </Typography>
                  <Button
                    component="a"
                    href={SITE.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    endIcon={<ArrowOutwardIcon />}
                    sx={{ color: "var(--text)" }}
                  >
                    {t("mapsCta")}
                  </Button>
                </Stack>
              </GlassCard>
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
