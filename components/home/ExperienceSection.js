"use client";

import Image from "next/image";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import GarageOutlinedIcon from "@mui/icons-material/GarageOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import RoomServiceOutlinedIcon from "@mui/icons-material/RoomServiceOutlined";
import DeckOutlinedIcon from "@mui/icons-material/DeckOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlassCard, { cardPadding, cardRadius } from "@/components/ui/GlassCard";

const ITEMS = [
  { key: "garage", Icon: GarageOutlinedIcon },
  { key: "security", Icon: ShieldOutlinedIcon },
  { key: "reception", Icon: RoomServiceOutlinedIcon },
  { key: "terrace", Icon: DeckOutlinedIcon },
  { key: "lounge", Icon: WeekendOutlinedIcon },
  { key: "housekeeping", Icon: CleaningServicesOutlinedIcon },
];

function Tile({ item, index }) {
  const t = useTranslations("home.experience.items");
  const { Icon } = item;
  return (
    <Reveal delay={(index % 3) * 0.08} style={{ height: "100%" }}>
      <GlassCard
        sx={{
          height: "100%",
          p: cardPadding,
          "&:hover": { transform: "translateY(-6px)", borderColor: "var(--primary)" },
          "&:hover .tile-icon": { bgcolor: "var(--primary)", color: "#fff" },
        }}
      >
        <Box
          className="tile-icon"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: "var(--primary-glow)",
            color: "var(--primary)",
            mb: 2.5,
            transition: "background-color 300ms ease, color 300ms ease",
          }}
        >
          <Icon />
        </Box>
        <Typography variant="h6" sx={{ mb: 0.75 }}>
          {t(`${item.key}.title`)}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--text-muted)", lineHeight: 1.65 }}>
          {t(`${item.key}.desc`)}
        </Typography>
      </GlassCard>
    </Reveal>
  );
}

export default function ExperienceSection() {
  const t = useTranslations("home.experience");

  return (
    <Box component="section" id="amenities" className="section-anchor" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHeading index="03" kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} sx={{ mb: { xs: 5, md: 7 } }} />

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Reveal style={{ height: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  minHeight: { xs: 320, md: "100%" },
                  borderRadius: cardRadius,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <Image
                  src="/images/dandela-house-parking.png"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: "cover", objectPosition: "center 35%" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 40%, rgba(10,13,12,0.85) 100%)",
                  }}
                />
                <Stack sx={{ position: "absolute", left: 32, right: 32, bottom: 32, color: "#f3ede2" }}>
                  <Typography variant="overline" sx={{ color: "var(--gold-soft)" }}>
                    Sapu · Saurimo
                  </Typography>
                  <Typography variant="h4" component="p" sx={{ fontStyle: "italic" }}>
                    DANDELA House
                  </Typography>
                </Stack>
              </Box>
            </Reveal>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {ITEMS.map((item, i) => (
                <Grid key={item.key} size={{ xs: 12, sm: 6 }}>
                  <Tile item={item} index={i} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
