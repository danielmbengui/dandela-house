"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, Container, Dialog, IconButton, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { galleryImages } from "@/lib/rooms";

const SPANS = {
  wide: { gridColumn: { xs: "span 2", md: "span 2" }, gridRow: "span 1" },
  tall: { gridColumn: "span 1", gridRow: { xs: "span 1", md: "span 2" } },
  square: { gridColumn: "span 1", gridRow: "span 1" },
};

export default function GallerySection() {
  const t = useTranslations("home.gallery");
  const [index, setIndex] = useState(null);

  const label = (img) =>
    img.room ? t(`labels.${img.key}`, { name: img.room }) : t(`labels.${img.key}`);

  const open = index !== null;
  const current = open ? galleryImages[index] : null;
  const step = (dir) =>
    setIndex((i) => (i + dir + galleryImages.length) % galleryImages.length);

  return (
    <Box component="section" id="gallery" className="section-anchor" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHeading index="04" kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} sx={{ mb: { xs: 5, md: 7 } }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gridAutoRows: { xs: 160, sm: 200, md: 230 },
            gridAutoFlow: "dense",
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {galleryImages.map((img, i) => (
            <Box key={`${img.src}-${i}`} sx={{ ...SPANS[img.span ?? "square"], minHeight: 0 }}>
              <Reveal delay={(i % 4) * 0.06} style={{ height: "100%" }}>
              <Box
                component="button"
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${t("open")} — ${label(img)}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  p: 0,
                  cursor: "pointer",
                  bgcolor: "var(--bg-elev)",
                  "&:hover img": { transform: "scale(1.06)" },
                  "&:hover .gallery-label": { opacity: 1, transform: "translateY(0)" },
                  "&:focus-visible": { outline: "2px solid var(--primary)", outlineOffset: 2 },
                }}
              >
                <Image
                  src={img.src}
                  alt={label(img)}
                  fill
                  sizes="(max-width: 900px) 50vw, 25vw"
                  style={{ objectFit: "cover", transition: "transform 1.1s cubic-bezier(.22,1,.36,1)" }}
                />
                <Box
                  className="gallery-label"
                  sx={{
                    position: "absolute",
                    left: 12,
                    bottom: 12,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: "rgba(10,13,12,0.6)",
                    color: "#f3ede2",
                    backdropFilter: "blur(8px)",
                    fontSize: 12,
                    opacity: { xs: 1, md: 0 },
                    transform: { xs: "none", md: "translateY(6px)" },
                    transition: "opacity 300ms ease, transform 400ms ease",
                  }}
                >
                  {label(img)}
                </Box>
              </Box>
              </Reveal>
            </Box>
          ))}
        </Box>
      </Container>

      <Dialog
        open={open}
        onClose={() => setIndex(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: { bgcolor: "transparent", boxShadow: "none", overflow: "visible", m: { xs: 1, md: 3 } },
          },
          backdrop: { sx: { bgcolor: "rgba(5,7,6,0.9)", backdropFilter: "blur(10px)" } },
        }}
      >
        {current ? (
          <Box sx={{ position: "relative", width: "100%", height: { xs: "70vh", md: "82vh" } }}>
            <Image
              key={current.src}
              src={current.src}
              alt={label(current)}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
            />
            <Typography
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -8,
                textAlign: "center",
                color: "rgba(243,237,226,0.7)",
                fontSize: 13,
              }}
            >
              {label(current)} · {index + 1}/{galleryImages.length}
            </Typography>
            <IconButton
              onClick={() => setIndex(null)}
              aria-label={t("close")}
              sx={{ position: "absolute", top: -4, right: -4, color: "#f3ede2", bgcolor: "rgba(243,237,226,0.1)" }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <IconButton
              onClick={() => step(-1)}
              aria-label="previous"
              sx={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", color: "#f3ede2", bgcolor: "rgba(243,237,226,0.1)" }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
            <IconButton
              onClick={() => step(1)}
              aria-label="next"
              sx={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", color: "#f3ede2", bgcolor: "rgba(243,237,226,0.1)" }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>
        ) : null}
      </Dialog>
    </Box>
  );
}
