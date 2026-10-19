"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslations } from "next-intl";
import GlassCard, { cardPadding } from "@/components/ui/GlassCard";
import { publishedRooms } from "@/lib/rooms";
import { whatsappHref } from "@/lib/site";

const fieldSx = {
  flex: 1,
  minWidth: { xs: "100%", sm: 150 },
  "& .MuiInputBase-root": {
    borderRadius: 3,
    bgcolor: "var(--surface)",
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
  "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border-strong)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--primary) !important",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--primary)" },
  "& input::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
    opacity: 0.7,
  },
};

function toDisplayDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

export default function QuickBooking({ sx }) {
  const t = useTranslations("home.booking");
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState("any");

  const href = useMemo(() => {
    const room = publishedRooms.find((r) => r.id === roomId);
    const message = t("message", {
      room: room ? t("roomNamed", { name: room.name }) : t("roomAny"),
      checkIn: toDisplayDate(checkIn) ?? t("undated"),
      checkOut: toDisplayDate(checkOut) ?? t("undated"),
      guests: t("guestsValue", { count: guests }),
    });
    return whatsappHref(message);
  }, [t, roomId, checkIn, checkOut, guests]);

  return (
    <GlassCard
      strong
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
      sx={{ p: cardPadding, ...sx }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 2, lg: 3 }}
        sx={{ alignItems: { lg: "center" } }}
      >
        <Box sx={{ minWidth: { lg: 200 } }}>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {t("title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
            {t("subtitle")}
          </Typography>
        </Box>

        <Stack
          direction="row"
          sx={{ flex: 1, flexWrap: "wrap", gap: 1.5 }}
        >
          <TextField
            label={t("checkIn")}
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: today },
            }}
            sx={fieldSx}
          />
          <TextField
            label={t("checkOut")}
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: checkIn || today },
            }}
            sx={fieldSx}
          />
          <TextField
            select
            label={t("guests")}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            sx={fieldSx}
          >
            {[1, 2, 3, 4].map((n) => (
              <MenuItem key={n} value={n}>
                {t("guestsValue", { count: n })}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t("room")}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="any">{t("anyRoom")}</MenuItem>
            {publishedRooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<WhatsAppIcon />}
          sx={{ whiteSpace: "nowrap", px: 3, py: 1.4 }}
        >
          {t("submit")}
        </Button>
      </Stack>
    </GlassCard>
  );
}
