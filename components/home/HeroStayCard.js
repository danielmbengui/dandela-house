"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import BrandLogo from "@/components/brand/BrandLogo";

export default function HeroStayCard() {
  const t = useTranslations("hero");
  const stats = [
    { value: t("cardStat1Value"), label: t("cardStat1Label") },
    { value: t("cardStat2Value"), label: t("cardStat2Label") },
    { value: t("cardStat3Value"), label: t("cardStat3Label") },
  ];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", flex: 1.15, minHeight: 0 }}>
        <Image
          src="/images/dandela-house-parking.png"
          alt=""
          fill
          sizes="(min-width: 900px) 40vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(13,28,22,0.18) 0%, rgba(13,28,22,0.05) 55%, rgba(13,28,22,0.45) 100%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            right: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              px: 1.25,
              py: 0.6,
              borderRadius: 999,
              border: "1px solid rgba(189,167,124,0.8)",
              bgcolor: "rgba(13,28,22,0.5)",
              backdropFilter: "blur(10px)",
              color: "#f8f2e8",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {t("cardPlace")}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,252,247,0.94)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.22)",
            }}
          >
            <BrandLogo variant="mark" height={32} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: "#fffcf7", color: "#182d25", px: 2, py: 1.75 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {stats.map((stat) => (
            <Box key={stat.label}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  lineHeight: 1,
                  color: "#8b3045",
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  mt: 0.6,
                  fontSize: 12,
                  lineHeight: 1.25,
                  color: "#3d5548",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography
          sx={{
            mt: 1.4,
            pt: 1.15,
            borderTop: "1px solid #e8dfd0",
            fontSize: 13,
            color: "#182d25",
          }}
        >
          {t("cardLine")}
        </Typography>
      </Box>
    </Box>
  );
}
