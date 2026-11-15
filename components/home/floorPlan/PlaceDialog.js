"use client";

import Image from "next/image";
import { Box, Button, Chip, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslations } from "next-intl";
import { formatKz } from "@/lib/format";
import { whatsappHref } from "@/lib/site";

function isAbsoluteUrl(src) {
  return /^https?:\/\//i.test(String(src ?? ""));
}

function CoverPhoto({ src, alt }) {
  if (!src) return null;
  if (isAbsoluteUrl(src)) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover" }} />;
}

/**
 * Fiche d'un lieu du plan : chambre (prix, équipements, réservation) ou espace commun.
 * Le texte est la `description` en base ; sans description, une chambre reprend le texte
 * commun à toutes les chambres et un espace commun n'affiche que son nom et sa photo.
 *
 * @param {{ open: boolean, onClose: () => void, place: object | null, kicker?: string }} props
 */
export default function PlaceDialog({ open, onClose, place, kicker = "" }) {
  const t = useTranslations("home.floorPlan");
  const tRooms = useTranslations("home.rooms");
  const tBooking = useTranslations("home.booking");

  const data = place?.source ?? null;
  const isRoom = place?.type === "room";
  const bookable = isRoom && data && !data.comingSoon;
  const body = data?.description?.trim() || (isRoom ? tRooms("subtitle") : "");

  const bookHref = bookable
    ? whatsappHref(
        tBooking("message", {
          room: tBooking("roomNamed", { name: place.name }),
          checkIn: tBooking("undated"),
          checkOut: tBooking("undated"),
          guests: tBooking("guestsValue", { count: 2 }),
        }),
      )
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          // Le dialogue sort du flux de la page : il reprend ici la police sans-serif de l'accueil.
          className: "home-page-sans",
          sx: {
            borderRadius: 3,
            bgcolor: "var(--card-color)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label={t("close")}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          color: "#f8f3ec",
          bgcolor: "rgba(10,13,12,0.5)",
          "&:hover": { bgcolor: "rgba(10,13,12,0.7)" },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        {data?.cover ? (
          <Box sx={{ position: "relative", width: "100%", aspectRatio: "16/10", bgcolor: "var(--bg-elev)" }}>
            <CoverPhoto src={data.cover} alt={place.name} />
          </Box>
        ) : (
          <Box sx={{ height: 48 }} />
        )}

        <Stack spacing={2} sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box>
            {kicker ? (
              <Typography variant="overline" sx={{ color: "var(--primary)" }}>
                {kicker}
              </Typography>
            ) : null}
            <Typography variant="h4" component="h2" sx={{ mt: 0.5, fontSize: { xs: "1.75rem", md: "2rem" } }}>
              {place?.name}
            </Typography>
          </Box>

          {body ? (
            <Typography sx={{ color: "var(--text-muted)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
              {body}
            </Typography>
          ) : null}

          {bookable ? (
            <>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text)" }}>
                {formatKz(data.price)}
                <Typography component="span" variant="caption" sx={{ ml: 1, color: "var(--text-muted)" }}>
                  {tRooms("perNight")}
                </Typography>
              </Typography>

              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                {(data.featureKeys ?? []).map((key) => (
                  <Chip
                    key={key}
                    size="small"
                    label={tRooms(`features.${key}`)}
                    sx={{ bgcolor: "var(--surface)", border: "1px solid var(--border)" }}
                  />
                ))}
              </Stack>

              <Button
                component="a"
                href={bookHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                startIcon={<WhatsAppIcon />}
                sx={{ alignSelf: "flex-start", mt: 0.5 }}
              >
                {tRooms("book")}
              </Button>
            </>
          ) : null}

          {isRoom && data?.comingSoon ? (
            <Chip label={tRooms("soon")} size="small" sx={{ alignSelf: "flex-start" }} />
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
