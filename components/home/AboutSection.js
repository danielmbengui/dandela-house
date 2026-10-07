"use client";

import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

const stats = ["stat1", "stat2", "stat3"];

export default function AboutSection() {
  const t = useTranslations("about");

  return (
    <Box
      component="section"
      id="about"
      className="section-anchor"
      sx={{ py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
                DANDELA House · Sapu
              </Typography>
              <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
                {t("title")}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {t("lead")}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {t("p1")}
              </Typography>
              <Typography color="text.secondary">{t("p2")}</Typography>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {stats.map((key, index) => (
                <Grid key={key} size={{ xs: 12, sm: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card sx={{ bgcolor: "var(--card-color)" }}>
                      <CardContent>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                          {t(`${key}Value`)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t(`${key}Label`)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
