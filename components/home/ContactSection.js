"use client";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("contact");

  return (
    <Box
      component="section"
      id="contact"
      className="section-anchor"
      sx={{ py: { xs: 8, md: 12 }, pb: 12 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
                {t("title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {t("subtitle")}
              </Typography>
              <Stack spacing={2}>
                <ContactRow icon={<EmailOutlinedIcon />} label={t("email")} href={`mailto:${t("email")}`} />
                <ContactRow icon={<PhoneOutlinedIcon />} label={t("phone")} href={`tel:${t("phone").replace(/\s/g, "")}`} />
                <ContactRow icon={<PlaceOutlinedIcon />} label={t("address")} />
              </Stack>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card sx={{ p: { xs: 2, md: 3 }, bgcolor: "var(--card-color)" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t("formNote")}
                </Typography>
                <Stack spacing={2} component="form" onSubmit={(e) => e.preventDefault()}>
                  <TextField label={t("formName")} fullWidth required />
                  <TextField label={t("formEmail")} type="email" fullWidth required />
                  <TextField
                    label={t("formMessage")}
                    fullWidth
                    required
                    multiline
                    minRows={4}
                  />
                  <Button type="submit" variant="contained" color="primary" size="large">
                    {t("formSubmit")}
                  </Button>
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function ContactRow({ icon, label, href }) {
  const content = (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
      <Box sx={{ color: "var(--primary)", mt: 0.25 }}>{icon}</Box>
      <Typography>{label}</Typography>
    </Stack>
  );

  if (href) {
    return (
      <Box component="a" href={href} sx={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </Box>
    );
  }
  return content;
}
