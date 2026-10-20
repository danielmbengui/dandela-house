"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useLocale, useTranslations } from "next-intl";
import { videoTourSrcForLocale } from "@/lib/videoTour";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import BrandLogo from "@/components/brand/BrandLogo";
import { cardRadius } from "@/components/ui/GlassCard";

const POSTER_SRC = "/images/outside/1.jpeg";

function LandscapeFrame({ children }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { md: "100%" },
        aspectRatio: "16 / 9",
        minHeight: { xs: 220, sm: 280, md: 360, lg: 420 },
        borderRadius: { xs: "11px", md: "20px" },
        overflow: "hidden",
        bgcolor: "#050706",
        boxShadow: "0 28px 70px -32px rgba(0,0,0,0.55)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}

export default function VideoTourSection() {
  const t = useTranslations("home.video");
  const locale = useLocale();
  const videoSrc = videoTourSrcForLocale(locale);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanLoad(true);
          node.play().catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [videoSrc]);

  useEffect(() => {
    if (!canLoad) return undefined;
    const node = videoRef.current;
    if (!node) return undefined;
    const start = () => node.play().catch(() => {});
    start();
    node.addEventListener("loadeddata", start, { once: true });
    return () => node.removeEventListener("loadeddata", start);
  }, [canLoad, videoSrc]);

  useEffect(() => {
    setPlaying(false);
  }, [videoSrc]);

  const togglePlay = () => {
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) node.play().catch(() => {});
    else node.pause();
  };

  const toggleMute = () => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = !node.muted;
    setMuted(node.muted);
    if (node.paused) node.play().catch(() => {});
  };

  const controlSx = {
    bgcolor: "rgba(10,13,12,0.6)",
    color: "#f3ede2",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(243,237,226,0.25)",
    "&:hover": { bgcolor: "rgba(10,13,12,0.8)" },
  };

  return (
    <Box
      component="section"
      id="about"
      className="section-anchor"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        overflow: "hidden",
        background:
          "radial-gradient(70% 60% at 18% 50%, var(--gold-glow) 0%, transparent 70%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 7 }} sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Reveal y={32} duration={1}>
              <LandscapeFrame>
                <video
                  key={videoSrc}
                  ref={videoRef}
                  src={canLoad ? videoSrc : undefined}
                  poster={POSTER_SRC}
                  muted
                  loop
                  playsInline
                  preload="none"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center center",
                    display: "block",
                  }}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ position: "absolute", right: 16, bottom: 16, zIndex: 2 }}
                >
                  <IconButton size="small" onClick={togglePlay} aria-label={playing ? t("pause") : t("play")} sx={controlSx}>
                    {playing ? <PauseRoundedIcon fontSize="small" /> : <PlayArrowRoundedIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={toggleMute} aria-label={muted ? t("unmute") : t("mute")} sx={controlSx}>
                    {muted ? <VolumeOffRoundedIcon fontSize="small" /> : <VolumeUpRoundedIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </LandscapeFrame>
            </Reveal>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <SectionHeading index="02" kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />
            <Reveal delay={0.15}>
              <Stack spacing={1.75} sx={{ mt: 4 }}>
                {["point1", "point2", "point3"].map((key) => (
                  <Stack key={key} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        mt: "2px",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "var(--primary-glow)",
                        color: "var(--primary)",
                        flexShrink: 0,
                      }}
                    >
                      <CheckRoundedIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {t(key)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Reveal>
            <Reveal delay={0.25}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 5 }}>
                <BrandLogo variant="markGold" height={40} tone="light" />
                <Typography variant="body2" sx={{ color: "var(--text-faint)" }}>
                  {t("caption")}
                </Typography>
              </Stack>
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
