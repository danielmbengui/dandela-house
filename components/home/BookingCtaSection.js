"use client";

import Image from "next/image";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { SITE, whatsappHref } from "@/lib/site";
import { cardRadius } from "@/components/ui/GlassCard";

const CREAM = "#f3ede2";

export default function BookingCtaSection() {
  const t = useTranslations("home.cta");
  const tLoc = useTranslations("home.location");

  return (
    <Box component="section" id="contact" className="section-anchor" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Reveal>
            <Box
              sx={{
                overflow: "hidden",
                borderRadius: cardRadius,
                border: "1px solid var(--border)",
                bgcolor: "var(--card-color)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: { xs: "4 / 3", md: "21 / 9" },
                  minHeight: { xs: 240, md: 320 },
                  bgcolor: "var(--bg-elev)",
                }}
              >
                <Box
                  component="iframe"
                  title={tLoc("mapTitle")}
                  src={SITE.mapsEmbedSrc}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    display: "block",
                  }}
                />
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                  p: { xs: 2.5, md: 3 },
                  borderTop: "1px solid var(--border)",
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start", flex: 1 }}>
                  <PlaceOutlinedIcon sx={{ color: "var(--primary)", mt: "2px", flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, lineHeight: 1.35, mb: 0.5 }}>
                      {SITE.mapsPlaceName}
                    </Typography>
                    <Typography sx={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {tLoc("address")}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component="a"
                  href={SITE.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="primary"
                  className="arrow-link"
                  endIcon={<ArrowOutwardIcon className="arrow" sx={{ fontSize: 18 }} />}
                  sx={{ flexShrink: 0, alignSelf: { xs: "stretch", sm: "center" } }}
                >
                  {tLoc("mapsCta")}
                </Button>
              </Stack>
            </Box>
          </Reveal>

          <Reveal>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: cardRadius,
                px: { xs: 4, md: 8 },
                py: { xs: 7.5, md: 11 },
                color: CREAM,
                textAlign: "center",
                border: "1px solid rgba(217,180,91,0.3)",
                isolation: "isolate",
              }}
            >
              <Image
                src="/images/rooms/K.%20Kubango/2.jpg"
                alt=""
                fill
                sizes="100vw"
                style={{ objectFit: "cover", zIndex: -2 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: -1,
                  background:
                    "radial-gradient(60% 80% at 50% 100%, rgba(217,180,91,0.28) 0%, transparent 60%), linear-gradient(180deg, rgba(10,13,12,0.82) 0%, rgba(10,13,12,0.9) 100%)",
                }}
              />
              <Box className="grain" sx={{ position: "absolute", inset: 0, zIndex: -1 }} />

              <Typography variant="overline" sx={{ color: "var(--gold-soft)" }}>
                {t("kicker")}
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: { xs: "2.5rem", sm: "3.2rem", md: "4.2rem" }, mt: 1.5, mb: 2, color: CREAM }}
              >
                {t("title")}
              </Typography>
              <Typography sx={{ color: "rgba(243,237,226,0.78)", maxWidth: 620, mx: "auto", lineHeight: 1.7, mb: 5 }}>
                {t("subtitle")}
              </Typography>

              <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}
                >
                  {SITE.phones.map((phone, index) => (
                    <Button
                      key={phone.e164}
                      component="a"
                      href={whatsappHref(undefined, phone.e164)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant={index === 0 ? "contained" : "outlined"}
                      color={index === 0 ? "primary" : "inherit"}
                      size="large"
                      startIcon={<WhatsAppIcon />}
                      aria-label={`${t("whatsapp")} ${phone.display}`}
                      sx={{
                        px: 2.5,
                        py: 1.4,
                        fontSize: "0.98rem",
                        ...(index === 0
                          ? {}
                          : {
                              color: CREAM,
                              borderColor: "rgba(243,237,226,0.35)",
                              "&:hover": { borderColor: CREAM, bgcolor: "rgba(243,237,226,0.08)" },
                            }),
                      }}
                    >
                      {phone.display}
                    </Button>
                  ))}
                </Stack>
                <Button
                  component="a"
                  href={`mailto:${SITE.email}`}
                  variant="text"
                  size="large"
                  startIcon={<MailOutlineRoundedIcon />}
                  sx={{ color: CREAM, px: 2.5, py: 1.5, "&:hover": { bgcolor: "rgba(243,237,226,0.08)" } }}
                >
                  {t("email")}
                </Button>
              </Stack>

              <Typography variant="caption" sx={{ display: "block", mt: 4, color: "rgba(243,237,226,0.6)" }}>
                {t("hours")}
              </Typography>
            </Box>
          </Reveal>
        </Stack>
      </Container>
    </Box>
  );
}
