"use client";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { SITE, whatsappHref } from "@/lib/site";

const exploreLinks = [
  { key: "rooms", hash: "rooms" },
  { key: "about", hash: "about" },
  { key: "amenities", hash: "amenities" },
  { key: "gallery", hash: "gallery" },
  { key: "contact", hash: "contact" },
];

const linkSx = {
  color: "var(--text-muted)",
  textDecoration: "none",
  fontSize: 15,
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  width: "fit-content",
  transition: "color 200ms ease",
  "&:hover": { color: "var(--primary)" },
};

function ArrowLink({ href, external, children }) {
  const props = external
    ? { component: "a", href, target: "_blank", rel: "noopener noreferrer" }
    : { component: Link, href };
  return (
    <Box {...props} className="arrow-link" sx={linkSx}>
      {children}
      <Box component="span" className="arrow" aria-hidden>
        ↗
      </Box>
    </Box>
  );
}

export default function SiteFooter() {
  const t = useTranslations();
  const tLoc = useTranslations("home.location");
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ mt: { xs: 4, md: 6 }, bgcolor: "var(--card-color)", borderTop: "1px solid var(--border)" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: 4 }}>
        <Typography
          className="font-serif"
          sx={{
            fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.6rem" },
            lineHeight: 0.95,
            maxWidth: 820,
            mb: { xs: 6, md: 8 },
          }}
        >
          {t("footer.statement")}<Box component="span" sx={{ color: "var(--primary)" }}>.</Box>
        </Typography>

        <Grid container spacing={{ xs: 5, md: 4 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <BrandLogo height={72} />
            <Typography sx={{ color: "var(--text-muted)", mt: 2.5, maxWidth: 340, lineHeight: 1.7 }}>
              {t("footer.tagline")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="overline" sx={{ color: "var(--primary)" }}>
              {t("footer.exploreTitle")}
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {exploreLinks.map((item) => (
                <ArrowLink key={item.key} href={{ pathname: "/", hash: item.hash }}>
                  {t(`nav.${item.key}`)}
                </ArrowLink>
              ))}
              <ArrowLink href="/chambres-tarifs">{t("nav.roomsPage")}</ArrowLink>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="overline" sx={{ color: "var(--primary)" }}>
              {t("footer.socialTitle")}
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <ArrowLink external href={whatsappHref()}>WhatsApp</ArrowLink>
              <ArrowLink external href={SITE.social.facebook}>Facebook</ArrowLink>
              <ArrowLink external href={SITE.social.instagram}>Instagram</ArrowLink>
              <ArrowLink external href={SITE.social.tiktok}>TikTok</ArrowLink>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="overline" sx={{ color: "var(--primary)" }}>
              {t("footer.contactTitle")}
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {SITE.phones.map((phone) => (
                <ArrowLink key={phone.e164} external href={whatsappHref(undefined, phone.e164)}>
                  {phone.display}
                </ArrowLink>
              ))}
              <ArrowLink external href={`mailto:${SITE.email}`}>{SITE.email}</ArrowLink>
              <Typography sx={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6 }}>
                {tLoc("address")}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 3,
            borderTop: "1px solid var(--border)",
            justifyContent: "space-between",
            alignItems: { sm: "center" },
          }}
        >
          <Typography variant="caption" sx={{ color: "var(--text-faint)" }}>
            © {year} DANDELA House. {t("footer.rights")}
          </Typography>
          <Box
            component="a"
            href="#top"
            className="arrow-link"
            sx={{ ...linkSx, fontSize: 13, letterSpacing: "0.04em" }}
          >
            {t("footer.backToTop")}
            <Box component="span" className="arrow" aria-hidden>
              ↑
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
