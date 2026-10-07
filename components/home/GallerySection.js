"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { galleryImages } from "@/lib/rooms";

export default function GallerySection() {
  const t = useTranslations("gallery");

  return (
    <Box
      component="section"
      id="gallery"
      className="section-anchor"
      sx={{ py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4, maxWidth: 640 }}>
          <Typography variant="h3" component="h2">
            {t("title")}
          </Typography>
          <Typography color="text.secondary">{t("subtitle")}</Typography>
        </Stack>
        <Grid container spacing={2}>
          {galleryImages.map((img, index) => (
            <Grid key={img.src} size={{ xs: 12, sm: 6 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 220, md: 260 },
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
