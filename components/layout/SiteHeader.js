"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localeFlags, routing } from "@/i18n/routing";
import { useThemeMode } from "@/components/providers/ThemeModeProvider";
import BrandLogo from "@/components/brand/BrandLogo";

function LocaleFlag({ locale }) {
  return (
    <Image
      src={localeFlags[locale]}
      alt=""
      width={24}
      height={16}
      style={{
        width: 24,
        height: 16,
        objectFit: "cover",
        borderRadius: 2,
        display: "block",
      }}
    />
  );
}

const navItems = [
  { key: "about", hash: "about" },
  { key: "amenities", hash: "amenities" },
  { key: "gallery", hash: "gallery" },
  { key: "rooms", route: "/chambres-tarifs" },
  { key: "contact", hash: "contact" },
];

export default function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode } = useThemeMode();
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);

  const themeIcons = {
    light: <LightModeOutlinedIcon fontSize="small" />,
    dark: <DarkModeOutlinedIcon fontSize="small" />,
    system: <SettingsBrightnessOutlinedIcon fontSize="small" />,
  };

  const isRoomsPage =
    pathname === "/chambres-tarifs" || pathname === "/rooms-rates";

  const renderNavButton = (item, onClick) => {
    const label = t(`nav.${item.key}`);
    if (item.route) {
      return (
        <Button
          key={item.key}
          component={Link}
          href={item.route}
          color="inherit"
          onClick={onClick}
          sx={{
            opacity: isRoomsPage ? 1 : 0.85,
            fontWeight: isRoomsPage ? 700 : 400,
          }}
        >
          {label}
        </Button>
      );
    }
    return (
      <Button
        key={item.key}
        component={Link}
        href={{ pathname: "/", hash: item.hash }}
        color="inherit"
        onClick={onClick}
        sx={{ opacity: 0.85 }}
      >
        {label}
      </Button>
    );
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "var(--header-blur)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--card-border)",
        color: "var(--font-color)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
          <Box
            component={Link}
            href="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <BrandLogo variant="mark" height={44} />
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", lg: "flex" }, flexGrow: 1, ml: 2 }}
          >
            {navItems.map((item) => renderNavButton(item))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={mode}
              onChange={(_, value) => value && setMode(value)}
              sx={{
                display: { xs: "none", sm: "flex" },
                "& .MuiToggleButton-root": {
                  borderColor: "var(--card-border)",
                  color: "var(--font-color)",
                  px: 1,
                },
              }}
            >
              {["light", "dark", "system"].map((m) => (
                <ToggleButton key={m} value={m} aria-label={t(`theme.${m}`)}>
                  {themeIcons[m]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Button
              size="small"
              variant="outlined"
              aria-label={t(`languages.${locale}`)}
              onClick={(e) => setLangAnchor(e.currentTarget)}
              sx={{
                borderColor: "var(--card-border)",
                color: "var(--font-color)",
                minWidth: 44,
                px: 1,
              }}
            >
              <LocaleFlag locale={locale} />
            </Button>
            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={() => setLangAnchor(null)}
            >
              {routing.locales.map((loc) => (
                <MenuItem
                  key={loc}
                  selected={loc === locale}
                  onClick={() => {
                    setLangAnchor(null);
                    router.replace(pathname, { locale: loc });
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                  >
                    <LocaleFlag locale={loc} />
                    {t(`languages.${loc}`)}
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            <Button
              component={Link}
              href={{ pathname: "/", hash: "contact" }}
              variant="contained"
              color="primary"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {t("nav.contactCta")}
            </Button>

            <IconButton
              sx={{ display: { lg: "none" } }}
              onClick={(e) => setMobileAnchor(e.currentTarget)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={mobileAnchor}
        open={Boolean(mobileAnchor)}
        onClose={() => setMobileAnchor(null)}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.key}
            component={Link}
            href={
              item.route
                ? item.route
                : { pathname: "/", hash: item.hash }
            }
            onClick={() => setMobileAnchor(null)}
          >
            {t(`nav.${item.key}`)}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
