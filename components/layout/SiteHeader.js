"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localeFlags, routing } from "@/i18n/routing";
import { useThemeMode } from "@/components/providers/ThemeModeProvider";
import BrandLogo from "@/components/brand/BrandLogo";
import { rooms } from "@/lib/rooms";
import { SITE, whatsappHref } from "@/lib/site";

function LocaleFlag({ locale }) {
  return (
    <Image
      src={localeFlags[locale]}
      alt=""
      width={22}
      height={15}
      style={{ width: 22, height: 15, objectFit: "cover", borderRadius: 2, display: "block" }}
    />
  );
}

const navItems = [
  { key: "rooms", hash: "rooms" },
  { key: "about", hash: "about" },
  { key: "amenities", hash: "amenities" },
  { key: "gallery", hash: "gallery" },
  { key: "contact", hash: "contact" },
];

const aroundItems = [
  { key: "faq", hash: "faq" },
  { key: "roomsPage", href: "/chambres-tarifs" },
];

export default function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode } = useThemeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef(null);

  const isHome = pathname === "/";
  const onDark = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, locale]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (event) => {
      if (!barRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const linkColor = onDark ? "#f3ede2" : "var(--text)";
  const borderColor = onDark ? "rgba(243,237,226,0.28)" : "var(--border)";

  const themeIcons = {
    light: <LightModeOutlinedIcon sx={{ fontSize: 16 }} />,
    dark: <DarkModeOutlinedIcon sx={{ fontSize: 16 }} />,
    system: <SettingsBrightnessOutlinedIcon sx={{ fontSize: 16 }} />,
  };

  const close = () => setMenuOpen(false);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        color: linkColor,
        transition: "background-color 400ms ease, border-color 400ms ease, color 300ms ease",
        bgcolor: scrolled || menuOpen ? "var(--header-blur)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(18px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled || menuOpen ? "blur(18px) saturate(140%)" : "none",
        borderBottom: `1px solid ${scrolled || menuOpen ? "var(--border)" : "transparent"}`,
      }}
    >
      <Container ref={barRef} maxWidth="lg" sx={{ position: "relative" }}>
        <Toolbar disableGutters sx={{ gap: 1.5, minHeight: { xs: 64, md: 76 } }}>
          <Box
            component={Link}
            href="/"
            aria-label="DANDELA House"
            onClick={close}
            sx={{ display: "flex", alignItems: "center", mr: { md: 2 } }}
          >
            <BrandLogo variant="mark" height={40} tone={onDark ? "dark" : "auto"} priority />
          </Box>

          <Stack
            component="nav"
            aria-label={t("nav.menu")}
            direction="row"
            spacing={0.25}
            sx={{ display: { xs: "none", lg: "flex" }, flexGrow: 1, alignItems: "center" }}
          >
            {navItems.map((item) => (
              <Box
                key={item.key}
                component={Link}
                href={{ pathname: "/", hash: item.hash }}
                className="nav-link"
                onClick={close}
                sx={{
                  px: 1.25,
                  py: 0.75,
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  opacity: 0.82,
                  transition: "opacity 200ms ease",
                  "&:hover": { opacity: 1 },
                }}
              >
                {t(`nav.${item.key}`)}
              </Box>
            ))}
          </Stack>

          <Box sx={{ flexGrow: { xs: 1, lg: 0 } }} />

          <Button
            component="a"
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            className="arrow-link"
            endIcon={<ArrowOutwardIcon className="arrow" sx={{ fontSize: 16 }} />}
            sx={{ display: { xs: "none", sm: "inline-flex" }, py: 0.9, px: 2 }}
          >
            {t("nav.contactCta")}
          </Button>

          <Button
            aria-expanded={menuOpen}
            aria-controls="site-nav-panel"
            onClick={() => setMenuOpen((open) => !open)}
            startIcon={menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
            sx={{
              color: "inherit",
              border: `1px solid ${menuOpen ? "var(--primary)" : borderColor}`,
              bgcolor: menuOpen ? "var(--primary)" : "transparent",
              borderRadius: "13px",
              px: 1.6,
              py: 0.85,
              minWidth: 0,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.01em",
              "&:hover": {
                bgcolor: menuOpen ? "var(--primary-dark)" : "transparent",
                borderColor: menuOpen ? "var(--primary-dark)" : borderColor,
              },
            }}
          >
            {t("nav.menu")}
          </Button>
        </Toolbar>

        {menuOpen ? (
          <Box
            id="site-nav-panel"
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 2,
              pt: 1.25,
              pb: 2,
            }}
          >
            <Box
              sx={{
                borderRadius: "28px",
                overflow: "hidden",
                bgcolor: "var(--card-color)",
                color: "var(--font-color)",
                border: "1px solid var(--border)",
                boxShadow: "0 28px 70px -28px rgba(0,0,0,0.45)",
                maxHeight: "calc(100vh - 96px)",
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1.05fr 1.15fr 0.95fr" },
                  gap: { xs: 3, md: 4 },
                  p: { xs: 2.5, md: 3.5 },
                }}
              >
                <Box
                  component={Link}
                  href={{ pathname: "/", hash: "contact" }}
                  onClick={close}
                  className="arrow-link"
                  sx={{
                    position: "relative",
                    minHeight: { xs: 168, md: 280 },
                    borderRadius: "20px",
                    overflow: "hidden",
                    color: "#f3ede2",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 3,
                  }}
                >
                  <Image
                    src={rooms[0].cover}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 360px"
                    style={{ objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(10,10,11,0.15) 0%, rgba(10,10,11,0.72) 100%)",
                    }}
                  />
                  <Typography
                    sx={{
                      position: "relative",
                      fontSize: 12,
                      letterSpacing: "0.16em",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {SITE.name.toUpperCase()}
                  </Typography>
                  <Typography
                    sx={{
                      position: "relative",
                      fontFamily: "var(--font-cormorant)",
                      fontSize: { xs: "2rem", md: "2.35rem" },
                      lineHeight: 1.05,
                      fontWeight: 500,
                    }}
                  >
                    {t("footer.statement")}
                    <ArrowOutwardIcon className="arrow" sx={{ fontSize: 22, ml: 0.75, verticalAlign: "middle" }} />
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      letterSpacing: "0.16em",
                      fontWeight: 600,
                      color: "var(--text-faint)",
                      mb: 1.5,
                    }}
                  >
                    {t("nav.about").toUpperCase()}
                  </Typography>
                  <Stack>
                    {navItems.map((item, index) => (
                      <Box
                        key={item.key}
                        component={Link}
                        href={{ pathname: "/", hash: item.hash }}
                        onClick={close}
                        className="arrow-link"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 1.35,
                          borderTop: "1px solid var(--border)",
                          color: "var(--font-color)",
                          fontSize: "1.05rem",
                          fontWeight: 500,
                          "&:hover": { color: "var(--primary)" },
                        }}
                      >
                        <Box component="span" sx={{ color: "var(--text-faint)", fontSize: 13, width: 22 }}>
                          {String(index + 1).padStart(2, "0")}
                        </Box>
                        <Box component="span" sx={{ flexGrow: 1 }}>
                          {t(`nav.${item.key}`)}
                        </Box>
                        <ArrowOutwardIcon className="arrow" sx={{ fontSize: 16 }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      letterSpacing: "0.16em",
                      fontWeight: 600,
                      color: "var(--text-faint)",
                      mb: 1.5,
                    }}
                  >
                    {t("nav.around").toUpperCase()}
                  </Typography>
                  <Stack>
                    {aroundItems.map((item) => (
                      <Box
                        key={item.key}
                        component={Link}
                        href={item.href ?? { pathname: "/", hash: item.hash }}
                        onClick={close}
                        className="arrow-link"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 1.35,
                          borderTop: "1px solid var(--border)",
                          color: "var(--font-color)",
                          fontSize: "1.05rem",
                          fontWeight: 500,
                          "&:hover": { color: "var(--primary)" },
                        }}
                      >
                        <Box component="span" sx={{ flexGrow: 1 }}>
                          {t(`nav.${item.key}`)}
                        </Box>
                        <ArrowOutwardIcon className="arrow" sx={{ fontSize: 16 }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 2.5, md: 4 }}
                sx={{
                  alignItems: { md: "center" },
                  justifyContent: "space-between",
                  px: { xs: 2.5, md: 3.5 },
                  py: 2.25,
                  borderTop: "1px solid var(--border)",
                  bgcolor: "color-mix(in srgb, var(--font-color) 4%, var(--card-color))",
                }}
              >
                <Box
                  component="a"
                  href={`mailto:${SITE.email}`}
                  className="arrow-link"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "var(--font-color)",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                >
                  {SITE.email}
                  <ArrowOutwardIcon className="arrow" sx={{ fontSize: 16 }} />
                </Box>

                <Stack spacing={1}>
                  <Typography sx={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, color: "var(--text-faint)" }}>
                    {t("nav.language").toUpperCase()}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                    {routing.locales.map((loc) => {
                      const selected = loc === locale;
                      return (
                        <Button
                          key={loc}
                          onClick={() => {
                            close();
                            router.replace(pathname, { locale: loc });
                          }}
                          startIcon={<LocaleFlag locale={loc} />}
                          sx={{
                            color: selected ? "#fff" : "var(--font-color)",
                            bgcolor: selected ? "var(--primary)" : "transparent",
                            borderRadius: "999px",
                            px: 1.4,
                            py: 0.6,
                            minWidth: 0,
                            fontSize: 14,
                            fontWeight: selected ? 600 : 500,
                            "&:hover": { bgcolor: selected ? "var(--primary-dark)" : "var(--primary-glow)" },
                          }}
                        >
                          {t(`languages.${loc}`)}
                        </Button>
                      );
                    })}
                  </Stack>
                </Stack>

                <Stack spacing={1}>
                  <Typography sx={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, color: "var(--text-faint)" }}>
                    {t("nav.appearance").toUpperCase()}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    {["light", "dark", "system"].map((value) => {
                      const selected = mode === value;
                      return (
                        <Button
                          key={value}
                          aria-label={t(`theme.${value}`)}
                          aria-pressed={selected}
                          onClick={() => setMode(value)}
                          startIcon={themeIcons[value]}
                          sx={{
                            color: selected ? "#fff" : "var(--font-color)",
                            bgcolor: selected ? "var(--primary)" : "transparent",
                            border: "1px solid",
                            borderColor: selected ? "var(--primary)" : "var(--border)",
                            borderRadius: "999px",
                            px: 1.4,
                            py: 0.55,
                            minWidth: 0,
                            fontSize: 13,
                            fontWeight: 500,
                            "&:hover": {
                              bgcolor: selected ? "var(--primary-dark)" : "var(--primary-glow)",
                              borderColor: selected ? "var(--primary-dark)" : "var(--border)",
                            },
                          }}
                        >
                          {t(`theme.${value}`)}
                        </Button>
                      );
                    })}
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Box>
        ) : null}
      </Container>
    </AppBar>
  );
}
