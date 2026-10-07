"use client";

import Image from "next/image";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { homeRooms } from "@/lib/rooms";

export default function RoomsSection() {
  const t = useTranslations("homeRooms");

  return (
    <Box
      component="section"
      id="rooms"
      className="section-anchor"
      sx={{ py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4, maxWidth: 640 }}>
          <Typography variant="h3" component="h2">
            {t("title")}
          </Typography>
          <Typography color="text.secondary">{t("subtitle")}</Typography>
        </Stack>

        <Stack spacing={4}>
          {homeRooms.map((room) => (
            <Grid
              key={room.id}
              container
              spacing={3}
              sx={{ alignItems: "center" }}
            >
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 280, md: 420 },
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <Image
                    src={room.cover}
                    alt={room.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 58vw"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {t("kicker")}
                </Typography>
                <Typography variant="h3" component="h3" sx={{ mt: 1, mb: 2 }}>
                  {room.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {t("lead")}
                </Typography>
                <Button
                  component={Link}
                  href={{ pathname: "/chambres-tarifs", hash: room.id }}
                  variant="contained"
                  color="primary"
                >
                  {t("cta")}
                </Button>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
