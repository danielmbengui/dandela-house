"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import ShowerOutlinedIcon from "@mui/icons-material/ShowerOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import { EASE } from "@/components/ui/Reveal";
import { homeRooms } from "@/lib/rooms";
import { formatKz } from "@/lib/format";
import { whatsappHref } from "@/lib/site";

const ICONS = {
  bed: BedOutlinedIcon,
  kitchenette: KitchenOutlinedIcon,
  fridge: KitchenOutlinedIcon,
  ac: AcUnitOutlinedIcon,
  bathroom: ShowerOutlinedIcon,
  tv: TvOutlinedIcon,
  wifi: WifiOutlinedIcon,
};

function RoomCard({ room, index, featured, compact }) {
  const t = useTranslations("home.rooms");
  const tBooking = useTranslations("home.booking");
  const reduce = useReducedMotion();
  const name = room.name ?? t("soonName");

  const bookHref = whatsappHref(
    tBooking("message", {
      room: room.name ? tBooking("roomNamed", { name: room.name }) : tBooking("roomAny"),
      checkIn: tBooking("undated"),
      checkOut: tBooking("undated"),
      guests: tBooking("guestsValue", { count: 2 }),
    }),
  );

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
      style={{ height: "100%" }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100%",
          minHeight: featured
            ? { xs: 440, md: 600 }
            : compact
              ? { xs: 420, md: 360 }
              : { xs: 400, md: 420 },
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid var(--border)",
          bgcolor: "var(--bg-elev)",
          boxShadow: "var(--shadow-soft)",
          cursor: "pointer",
          "&:hover .room-cover": { transform: "scale(1.06)" },
          "&:hover .room-door": { opacity: 1, transform: "translateY(0)" },
          "&:hover .room-body": { transform: "translateY(-6px)" },
          transition: "border-color 300ms ease",
          "&:hover": { borderColor: "var(--border-strong)" },
        }}
      >
        <Box
          className="room-cover"
          sx={{
            position: "absolute",
            inset: 0,
            transition: "transform 1.2s cubic-bezier(.22,1,.36,1)",
            filter: room.comingSoon ? "grayscale(0.6) brightness(0.7)" : "none",
          }}
        >
          <Image
            src={room.cover}
            alt={name}
            fill
            sizes={featured ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 33vw"}
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,13,12,0.05) 0%, rgba(10,13,12,0.15) 40%, rgba(10,13,12,0.88) 100%)",
          }}
        />

        {/* En-tête : numéro + plaque */}
        <Stack
          direction="row"
          sx={{ position: "absolute", top: 28, left: 28, right: 28, justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Chip
            label={room.comingSoon ? t("soon") : `0${index + 1}`}
            size="small"
            sx={{
              bgcolor: "rgba(10,13,12,0.55)",
              color: "#f3ede2",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(243,237,226,0.2)",
              fontFamily: "var(--font-cormorant)",
              fontSize: "1rem",
              px: 0.5,
            }}
          />
          {room.door ? (
            <Box
              className="room-door"
              sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid rgba(243,237,226,0.3)",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)",
                opacity: { xs: 1, md: 0 },
                transform: { xs: "none", md: "translateY(-8px)" },
                transition: "opacity 400ms ease, transform 500ms cubic-bezier(.22,1,.36,1)",
                position: "relative",
              }}
            >
              <Image
                src={room.door}
                alt={t("doorAlt", { name })}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </Box>
          ) : null}
        </Stack>

        {/* Corps */}
        <Box
          className="room-body"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: { xs: 3.5, md: 4.5 },
            color: "#f3ede2",
            transition: "transform 500ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-end", mb: 1.5 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontSize: featured
                  ? { xs: "2.4rem", md: "3.2rem" }
                  : compact
                    ? { xs: "1.9rem", md: "1.9rem" }
                    : { xs: "2rem", md: "2.3rem" },
              }}
            >
              {name}
            </Typography>
            {!room.comingSoon ? (
              <Box sx={{ textAlign: "right" }}>
                <Typography className="font-serif" sx={{ fontSize: { xs: "1.5rem", md: "1.7rem" }, lineHeight: 1, color: "var(--gold-soft)" }}>
                  {formatKz(room.price)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {t("perNight")}
                </Typography>
              </Box>
            ) : null}
          </Stack>

          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mb: 2 }}>
            {room.featureKeys.slice(0, compact ? 3 : 4).map((key) => {
              const Icon = ICONS[key] ?? BedOutlinedIcon;
              return (
                <Chip
                  key={key}
                  icon={<Icon sx={{ fontSize: 16, color: "inherit !important" }} />}
                  label={t(`features.${key}`)}
                  size="small"
                  sx={{
                    bgcolor: "rgba(243,237,226,0.1)",
                    color: "#f3ede2",
                    border: "1px solid rgba(243,237,226,0.16)",
                    backdropFilter: "blur(6px)",
                  }}
                />
              );
            })}
          </Stack>

          {!room.comingSoon ? (
            <Button
              component="a"
              href={bookHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<WhatsAppIcon />}
              sx={{ px: 2.25 }}
            >
              {t("book")}
            </Button>
          ) : null}
        </Box>
      </Box>
    </motion.article>
  );
}

export default function RoomsSection() {
  const t = useTranslations("home.rooms");
  const [first, ...rest] = homeRooms;

  return (
    <Box component="section" id="rooms" className="section-anchor" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" }, mb: { xs: 5, md: 7 } }}
        >
          <SectionHeading index="01" kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />
          <Button
            component={Link}
            href="/chambres-tarifs"
            variant="outlined"
            endIcon={<ArrowOutwardIcon />}
            sx={{ flexShrink: 0, color: "var(--text)" }}
          >
            {t("details")}
          </Button>
        </Stack>

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <RoomCard room={first} index={0} featured />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ height: "100%" }}>
              {rest.slice(0, 2).map((room, i) => (
                <Grid key={room.id} size={{ xs: 12, sm: 6, md: 12 }}>
                  <RoomCard room={room} index={i + 1} compact />
                </Grid>
              ))}
            </Grid>
          </Grid>
          {rest.slice(2).map((room, i) => (
            <Grid key={room.id} size={{ xs: 12, sm: 6 }}>
              <RoomCard room={room} index={i + 3} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
