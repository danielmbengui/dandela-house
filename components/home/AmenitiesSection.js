"use client";

import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import DeskOutlinedIcon from "@mui/icons-material/DeskOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import GarageOutlinedIcon from "@mui/icons-material/GarageOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

const items = [
  { key: "rooms", Icon: KingBedOutlinedIcon },
  { key: "reception", Icon: DeskOutlinedIcon },
  { key: "security", Icon: SecurityOutlinedIcon },
  { key: "garage", Icon: GarageOutlinedIcon },
  { key: "lounge", Icon: LocalBarOutlinedIcon },
  { key: "housekeeping", Icon: CleaningServicesOutlinedIcon },
];

export default function AmenitiesSection() {
  const t = useTranslations("amenities");

  return (
    <Box
      component="section"
      id="amenities"
      className="section-anchor"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "var(--card-color)",
        borderBlock: "1px solid var(--card-border)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 5, maxWidth: 720 }}>
          <Typography variant="h3" component="h2">
            {t("title")}
          </Typography>
          <Typography color="text.secondary">{t("subtitle")}</Typography>
        </Stack>
        <Grid container spacing={2}>
          {items.map(({ key, Icon }, index) => (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: "var(--background-color)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        mb: 1.5,
                        bgcolor: "color-mix(in srgb, var(--accent-green) 25%, transparent)",
                        color: "var(--secondary)",
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {t(`items.${key}.title`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(`items.${key}.desc`)}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
