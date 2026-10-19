"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Box, Button, Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EASE } from "@/components/ui/Reveal";
import { startingPrice } from "@/lib/rooms";
import { formatKz } from "@/lib/format";
import { whatsappHref } from "@/lib/site";
import QuickBooking from "./QuickBooking";

function HeroPromo({ label, unmuteLabel, muteLabel }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.play().catch(() => {});
        else node.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
      <Box
        sx={{
          position: "relative",
          width: { xs: 240, sm: 270, md: 300 },
          aspectRatio: "9 / 16",
          borderRadius: "40px",
          p: "9px",
          background: "linear-gradient(165deg, var(--secondary) 0%, var(--primary) 62%, var(--primary-dark) 100%)",
          boxShadow: "0 36px 80px -32px rgba(0,0,0,0.7)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "32px",
            overflow: "hidden",
            bgcolor: "#050706",
          }}
        >
          <video
            ref={videoRef}
            src="/videos/presentation-web.mp4"
            poster="/videos/poster.jpg"
            muted
            loop
            playsInline
            autoPlay
            aria-label={label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <IconButton
            size="small"
            aria-label={muted ? unmuteLabel : muteLabel}
            onClick={() => {
              const node = videoRef.current;
              if (!node) return;
              node.muted = !node.muted;
              setMuted(node.muted);
              if (node.paused) node.play().catch(() => {});
            }}
            sx={{
              position: "absolute",
              right: 12,
              bottom: 12,
              bgcolor: "rgba(10,13,12,0.6)",
              color: "#f3ede2",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(243,237,226,0.25)",
              "&:hover": { bgcolor: "rgba(10,13,12,0.82)" },
            }}
          >
            {muted ? <VolumeOffRoundedIcon fontSize="small" /> : <VolumeUpRoundedIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

const CREAM = "#f3ede2";
const CREAM_MUTED = "rgba(243, 237, 226, 0.78)";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const tVideo = useTranslations("home.video");
  const reduce = useReducedMotion();

  const stats = [1, 2, 3, 4].map((i) => ({
    value: t(`stat${i}Value`),
    label: t(`stat${i}Label`),
  }));

  return (
    <>
    <Box
      component="section"
      id="top"
      sx={{
        position: "relative",
        mt: { xs: "-64px", md: "-76px" },
        pt: { xs: "96px", md: "140px" },
        pb: { xs: 14, md: 18 },
        color: CREAM,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Photo de la façade, lent zoom */}
      <motion.div
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
        style={{ position: "absolute", inset: 0, zIndex: -3 }}
      >
        <Image
          src="/images/main-header.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 28%" }}
        />
      </motion.div>

      {/* Voiles : assombrissement + fondu vers le fond de page */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -2,
          background: `
            radial-gradient(60% 50% at 78% 38%, rgba(206,17,38,0.28) 0%, transparent 70%),
            linear-gradient(90deg, rgba(10,13,12,0.55) 0%, rgba(10,13,12,0.2) 55%, transparent 100%),
            linear-gradient(180deg, rgba(10,13,12,0.6) 0%, var(--hero-overlay) 45%, rgba(10,13,12,0.78) 100%),
            linear-gradient(180deg, transparent 70%, var(--background-color) 100%)
          `,
        }}
      />
      <Box className="grain" sx={{ position: "absolute", inset: 0, zIndex: -1 }} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div variants={container} initial={reduce ? false : "hidden"} animate="show">
              <motion.div variants={item}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "var(--gold)",
                      boxShadow: "0 0 0 6px var(--gold-glow)",
                    }}
                  />
                  <Typography variant="overline" sx={{ color: "var(--gold-soft)" }}>
                    {t("kicker")}
                  </Typography>
                </Stack>
              </motion.div>

              <motion.div variants={item}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: "clamp(2.35rem, 11vw, 3.2rem)",
                      sm: "4.4rem",
                      md: "5.4rem",
                      lg: "6.2rem",
                    },
                    color: CREAM,
                    mb: 3,
                    maxWidth: "100%",
                    overflowWrap: "anywhere",
                  }}
                >
                  {t("titleA")}
                  <br />
                  <Box component="span" className="gold-text gold-text-bright" sx={{ fontStyle: "italic" }}>
                    {t("titleB")}
                  </Box>
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Typography
                  sx={{
                    color: CREAM_MUTED,
                    fontSize: { xs: "1.05rem", md: "1.2rem" },
                    lineHeight: 1.7,
                    maxWidth: 560,
                    mb: 4,
                    fontWeight: 300,
                  }}
                >
                  {t("subtitle")}
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ alignItems: { xs: "stretch", sm: "center" }, mb: 4 }}
                >
                  <Button
                    component="a"
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<WhatsAppIcon />}
                    sx={{ px: 3.5, py: 1.5, fontSize: "1rem" }}
                  >
                    {t("ctaBook")}
                  </Button>
                  <Button
                    component={Link}
                    href={{ pathname: "/", hash: "rooms" }}
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowOutwardIcon />}
                    sx={{
                      px: 3.5,
                      py: 1.5,
                      fontSize: "1rem",
                      color: CREAM,
                      borderColor: "rgba(243,237,226,0.35)",
                      backdropFilter: "blur(8px)",
                      "&:hover": {
                        borderColor: CREAM,
                        bgcolor: "rgba(243,237,226,0.08)",
                      },
                    }}
                  >
                    {t("ctaRooms")}
                  </Button>
                </Stack>
              </motion.div>

              <motion.div variants={item}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
                  <Typography variant="body2" sx={{ color: CREAM_MUTED }}>
                    {t("from")}
                  </Typography>
                  <Typography
                    className="font-serif"
                    sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1, color: CREAM }}
                  >
                    {formatKz(startingPrice)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: CREAM_MUTED }}>
                    {t("perNight")}
                  </Typography>
                </Stack>
              </motion.div>

              <motion.div variants={item}>
                <Box
                  component={Link}
                  href={{ pathname: "/", hash: "rooms" }}
                  className="arrow-link"
                  sx={{
                    mt: 4,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    color: CREAM,
                    textDecoration: "none",
                    fontSize: 15,
                    letterSpacing: "0.04em",
                  }}
                >
                  {t("enter")}
                  <Box component="span" className="arrow" aria-hidden>
                    ↘
                  </Box>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
            >
              <HeroPromo label={t("sceneLabel")} unmuteLabel={tVideo("unmute")} muteLabel={tVideo("mute")} />
            </motion.div>
          </Grid>
        </Grid>

        {/* Statistiques */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
        >
          <Grid
            container
            spacing={0}
            sx={{
              mt: { xs: 6, md: 8 },
              borderTop: "1px solid rgba(243,237,226,0.18)",
            }}
          >
            {stats.map((s, i) => (
              <Grid
                key={s.label}
                size={{ xs: 6, md: 3 }}
                sx={{
                  py: 2.5,
                  pr: 2,
                  borderLeft: i === 0 ? "none" : { xs: i % 2 ? "1px solid rgba(243,237,226,0.18)" : "none", md: "1px solid rgba(243,237,226,0.18)" },
                  pl: i === 0 ? 0 : { xs: i % 2 ? 2 : 0, md: 3 },
                }}
              >
                <Typography
                  className="font-serif"
                  sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, lineHeight: 1, color: "var(--gold-soft)" }}
                >
                  {s.value}
                </Typography>
                <Typography variant="body2" sx={{ color: CREAM_MUTED, mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
      </Box>

      {/* Réservation express, à cheval sur le bas du hero */}
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 2, mt: { xs: -9, md: -11 } }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
        >
          <QuickBooking />
        </motion.div>
      </Container>
    </>
  );
}
