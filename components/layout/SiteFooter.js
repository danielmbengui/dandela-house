"use client";

import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useTranslations } from "next-intl";
import BrandLogo from "@/components/brand/BrandLogo";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/dandela.house.sapu",
    icon: <FacebookIcon fontSize="small" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@dandela.house",
    icon: <MusicNoteIcon fontSize="small" />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/244923000000",
    icon: <WhatsAppIcon fontSize="small" />,
  },
];

export default function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        py: 5,
        borderTop: "1px solid var(--card-border)",
        bgcolor: "var(--card-color)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <BrandLogo height={72} />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              {t("footer.socialTitle")}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {socialLinks.map((item) => (
                <IconButton
                  key={item.label}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  sx={{
                    border: "1px solid var(--card-border)",
                    color: "var(--primary)",
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t("footer.tagline")}
        </Typography>
        <Divider sx={{ my: 2, borderColor: "var(--card-border)" }} />
        <Typography variant="caption" color="text.secondary">
          © {year} DANDELA House. {t("footer.rights")}
        </Typography>
      </Container>
    </Box>
  );
}
