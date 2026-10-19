"use client";

import Image from "next/image";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { SITE, whatsappHref } from "@/lib/site";
import { cardRadius } from "@/components/ui/GlassCard";

const CREAM = "#f3ede2";

export default function BookingCtaSection() {
  const t = useTranslations("home.cta");

  return (
    <Box component="section" id="contact" className="section-anchor" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Reveal>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: cardRadius.xs, md: 7 },
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "center", alignItems: "center" }}
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
                {t("whatsapp")}
              </Button>
              <Button
                component="a"
                href={SITE.phoneHref}
                variant="outlined"
                size="large"
                startIcon={<CallOutlinedIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  color: CREAM,
                  borderColor: "rgba(243,237,226,0.35)",
                  "&:hover": { borderColor: CREAM, bgcolor: "rgba(243,237,226,0.08)" },
                }}
              >
                {t("call")} · {SITE.phoneDisplay}
              </Button>
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
      </Container>
    </Box>
  );
}
