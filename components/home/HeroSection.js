"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroStayCard from "./HeroStayCard";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: "relative",
        minHeight: { xs: "92dvh", md: "88dvh" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        pt: 10,
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/images/main-header.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 32%" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(125deg, var(--hero-overlay) 0%, rgba(139,48,69,0.35) 50%, rgba(168,198,108,0.2) 100%)`,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Chip
                label={t("badge")}
                sx={{
                  mb: 2,
                  bgcolor: "rgba(255,252,247,0.14)",
                  color: "#fffcf7",
                  border: "1px solid rgba(189,167,124,0.55)",
                  backdropFilter: "blur(8px)",
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "#fffcf7",
                  fontSize: { xs: "2.2rem", md: "3.35rem" },
                  lineHeight: 1.08,
                  mb: 2,
                  textShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}
              >
                {t("title")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(248,242,232,0.9)",
                  fontWeight: 400,
                  maxWidth: 620,
                  mb: 3,
                }}
              >
                {t("subtitle")}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  href="/chambres-tarifs"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {t("ctaPrimary")}
                </Button>
                <Button
                  component={Link}
                  href={{ pathname: "/", hash: "about" }}
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#fffcf7",
                    borderColor: "rgba(189,167,124,0.75)",
                    "&:hover": {
                      borderColor: "#bda77c",
                      bgcolor: "rgba(255,252,247,0.08)",
                    },
                  }}
                >
                  {t("ctaSecondary")}
                </Button>
              </Stack>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              <Box
                sx={{
                  height: { xs: 320, md: 440 },
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(189,167,124,0.55)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                  bgcolor: "#07110e",
                }}
              >
                <HeroStayCard />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
