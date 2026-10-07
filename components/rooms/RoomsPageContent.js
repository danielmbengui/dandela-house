"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { roomFeatureKeys, roomPlaceholders } from "@/lib/rooms";

export default function RoomsPageContent() {
  const t = useTranslations("roomsPage");

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 5, maxWidth: 760 }}>
          <Typography variant="h3" component="h1">
            {t("title")}
          </Typography>
          <Typography color="text.secondary">{t("intro")}</Typography>
        </Stack>

        <Card sx={{ mb: 5, bgcolor: "var(--card-color)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("buildingTitle")}
            </Typography>
            <Stack spacing={1} component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" color="text.secondary">
                {t("building.upstairs")}
              </Typography>
              <Typography component="li" color="text.secondary">
                {t("building.downstairs")}
              </Typography>
              <Typography component="li" color="text.secondary">
                {t("building.outside")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="h5" sx={{ mb: 2 }}>
          {t("featuresTitle")}
        </Typography>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 4 }}>
          {roomFeatureKeys.map((key) => (
            <Chip
              key={key}
              icon={<CheckCircleOutlinedIcon />}
              label={t(`features.${key}`)}
              sx={{
                bgcolor: "color-mix(in srgb, var(--accent-green) 22%, var(--card-color))",
                border: "1px solid var(--card-border)",
              }}
            />
          ))}
        </Stack>

        <Grid container spacing={3}>
          {roomPlaceholders.map((room, index) => (
            <Grid key={room.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <Card
                  id={room.id}
                  component="article"
                  sx={{
                    height: "100%",
                    overflow: "hidden",
                    bgcolor: "var(--card-color)",
                    scrollMarginTop: 96,
                  }}
                >
                  <Box sx={{ position: "relative", height: 200 }}>
                    <Image
                      src={room.cover ?? room.image}
                      alt={room.name ?? t(`roomNames.${room.id}`)}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 900px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {room.name ?? t(`roomNames.${room.id}`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {t("priceLabel")}:{" "}
                      <Box component="span" sx={{ color: "var(--primary)", fontWeight: 700 }}>
                        {t("priceSoon")}
                      </Box>
                    </Typography>
                    <Stack spacing={0.75}>
                      {roomFeatureKeys.slice(0, 4).map((key) => (
                        <Typography key={key} variant="caption" color="text.secondary">
                          • {t(`features.${key}`)}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          {t("priceNote")}
        </Typography>
      </Container>
    </Box>
  );
}
