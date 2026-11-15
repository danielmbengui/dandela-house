"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import { cardRadius } from "@/components/ui/GlassCard";
import PlaceDialog from "@/components/home/floorPlan/PlaceDialog";
import { FLOOR_PALETTES, LEGEND_TONES } from "@/components/home/floorPlan/palette";
import { useThemeMode } from "@/components/providers/ThemeModeProvider";
import { ZONES, buildFloors } from "@/lib/floorPlan";
import { formatKz } from "@/lib/format";
import { homeRooms } from "@/lib/rooms";

const FloorPlanCanvas = dynamic(() => import("@/components/home/floorPlan/FloorPlanCanvas"), {
  ssr: false,
});

/** Sans WebGL, la maquette ne s'affiche pas : la liste des lieux reste utilisable. */
class CanvasBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const KNOWN_KINDS = new Set(["room", "break-room", "waiting-room", "kitchen", "terrace", "parking"]);

/** Pastille de légende. */
function Swatch({ color, size = 12 }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "4px",
        bgcolor: color,
        border: "1px solid var(--border-strong)",
      }}
    />
  );
}

/** Repère de couleur d'une ligne de la liste (une barre : un carré se lirait comme une case à cocher). */
function ToneBar({ color }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 6,
        alignSelf: "stretch",
        minHeight: 32,
        flexShrink: 0,
        borderRadius: "3px",
        bgcolor: color,
        border: "1px solid var(--border-strong)",
      }}
    />
  );
}

/**
 * @param {{ rooms?: typeof homeRooms, commons?: object[] }} props
 */
export default function FloorPlanSection({ rooms: roomsProp, commons }) {
  const t = useTranslations("home.floorPlan");
  const tRooms = useTranslations("home.rooms");
  const { resolvedMode } = useThemeMode();
  const reducedMotion = useReducedMotion();

  const mode = resolvedMode === "dark" ? "dark" : "light";
  const palette = FLOOR_PALETTES[mode];
  const rooms = roomsProp?.length ? roomsProp : homeRooms;

  const floorName = useCallback(
    (level) => (level < 0 ? t("basementName", { level: -level }) : t("floorName", { floor: level })),
    [t],
  );
  const kindLabel = useCallback(
    (kind) => t(`kinds.${KNOWN_KINDS.has(kind) ? kind : "other"}`),
    [t],
  );
  const zoneTag = useCallback(
    (zone) => {
      const key = `zones.${zone}.tag`;
      return t.has(key) ? t(key) : "";
    },
    [t],
  );

  /** Étages + textes affichés sur la maquette (nom du lieu, catégorie, destination de l'escalier). */
  const floors = useMemo(() => {
    const built = buildFloors({ rooms, commons: commons ?? [] });
    const withStairs = built.filter((floor) => floor.hasStairs);

    return built.map((floor) => {
      // L'escalier mène à l'étage du dessus s'il existe, sinon il redescend au plus bas.
      const target =
        withStairs.find((other) => other.level > floor.level) ??
        withStairs.find((other) => other.level !== floor.level) ??
        null;
      const stairsTarget = floor.hasStairs && target ? target.level : null;

      const texts = {};
      for (const area of floor.areas) {
        if (area.kind === "place") {
          const place = floor.places.find((p) => p.id === area.placeId);
          if (place) texts[area.key] = { title: place.shortName, subtitle: kindLabel(place.kind) };
        } else if (area.kind === "zone") {
          texts[area.key] = {
            title: t(`zones.${area.zone}.name`),
            subtitle: zoneTag(area.zone),
          };
        } else if (area.kind === "stairs") {
          texts[area.key] = {
            title: t("stairs"),
            subtitle: stairsTarget === null ? "" : floorName(stairsTarget),
          };
        }
      }
      return { ...floor, stairsTarget, texts };
    });
  }, [rooms, commons, t, kindLabel, floorName, zoneTag]);

  const [activeLevel, setActiveLevel] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  /** Lieu de la fiche ; conservé après fermeture pour que le dialogue ne se vide pas pendant sa sortie. */
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Par défaut : le rez-de-chaussée (on entre par là), sinon l'étage le plus bas.
  const defaultLevel = floors.find((floor) => floor.level === 0)?.level ?? floors[0]?.level ?? 0;
  const active = floors.find((floor) => floor.level === activeLevel) ??
    floors.find((floor) => floor.level === defaultLevel) ??
    floors[0];

  const cardRef = useRef(null);
  const near = useInView(cardRef, { once: true, margin: "600px 0px" });
  const visible = useInView(cardRef, { margin: "80px 0px" });

  const selectFloor = useCallback((level) => {
    setHoveredKey(null);
    setActiveLevel(level);
  }, []);

  const openPlace = useCallback((place, level) => {
    setSelected({ place, level });
    setDialogOpen(true);
  }, []);

  const selectPlace = useCallback(
    (placeId) => {
      for (const floor of floors) {
        const place = floor.places.find((p) => p.id === placeId);
        if (place) {
          openPlace(place, floor.level);
          return;
        }
      }
    },
    [floors, openPlace],
  );

  if (!active) return null;

  const highlightKey = hoveredKey ?? (dialogOpen && selected ? `place:${selected.place.id}` : null);
  const legendTones = LEGEND_TONES.filter((tone) => active.areas.some((area) => area.tone === tone));

  const rowSx = (key, interactive, tone) => {
    const exterior = tone === "exterior";
    const emphasized = !exterior && highlightKey === key;
    return {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    width: "100%",
    textAlign: "left",
    px: 1.75,
    py: 1.4,
    borderRadius: "12px",
    border: "1px solid",
    borderStyle: exterior ? "dashed" : "solid",
    borderColor: emphasized ? "var(--primary)" : "var(--border)",
    bgcolor: emphasized ? "var(--primary-glow)" : "var(--surface)",
    color: exterior ? "var(--text-muted)" : "var(--text)",
    opacity: exterior ? 0.88 : 1,
    font: "inherit",
    cursor: interactive ? "pointer" : "default",
    transition: "border-color 200ms ease, background-color 200ms ease",
    "&:focus-visible": { outline: "2px solid var(--primary)", outlineOffset: 2 },
    };
  };

  return (
    <Box component="section" id="floor-plan" className="section-anchor" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          index="00"
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
          sx={{ mb: { xs: 4, md: 5 } }}
        />

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              ref={cardRef}
              sx={{
                position: "relative",
                height: { xs: 400, sm: 480, md: 580 },
                borderRadius: cardRadius,
                overflow: "hidden",
                border: "1px solid var(--border)",
                bgcolor: palette.background,
                boxShadow: "var(--shadow-soft)",
                transition: "background-color 500ms ease",
              }}
            >
              {near ? (
                <CanvasBoundary
                  fallback={
                    <Box sx={{ height: "100%", display: "grid", placeItems: "center", p: 4, textAlign: "center" }}>
                      <Typography sx={{ color: palette.overlayMuted, maxWidth: 320 }}>{t("unavailable")}</Typography>
                    </Box>
                  }
                >
                  <FloorPlanCanvas
                    floors={floors}
                    activeLevel={active.level}
                    palette={palette}
                    mode={mode}
                    highlightKey={highlightKey}
                    running={visible}
                    animate={!reducedMotion}
                    onSelectPlace={selectPlace}
                    onSelectFloor={selectFloor}
                    onHover={setHoveredKey}
                  />
                </CanvasBoundary>
              ) : null}

              {/* Étage affiché */}
              <Typography
                component="p"
                aria-live="polite"
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 18,
                  m: 0,
                  fontSize: { xs: "1.05rem", md: "1.25rem" },
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: palette.overlayText,
                  pointerEvents: "none",
                }}
              >
                {floorName(active.level)}
              </Typography>

              {/* Sélecteur d'étage, du plus bas au plus haut : le rez-de-chaussée d'abord */}
              {floors.length > 1 ? (
                <Stack
                  role="group"
                  aria-label={t("floorsLabel")}
                  spacing={0.75}
                  sx={{ position: "absolute", top: 16, right: 16 }}
                >
                  {floors.map((floor) => {
                    const current = floor.level === active.level;
                    return (
                      <Box
                        key={floor.level}
                        component="button"
                        type="button"
                        aria-pressed={current}
                        aria-label={floorName(floor.level)}
                        title={floorName(floor.level)}
                        onClick={() => selectFloor(floor.level)}
                        sx={{
                          minWidth: 44,
                          height: 44,
                          px: 1,
                          borderRadius: "12px",
                          border: "1px solid",
                          borderColor: current ? "var(--primary)" : "var(--border-strong)",
                          bgcolor: current ? "var(--primary)" : "var(--surface-strong)",
                          color: current ? "var(--primary-contrast)" : "var(--text)",
                          font: "inherit",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                          backdropFilter: "blur(8px)",
                          transition: "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
                          "&:hover": { borderColor: "var(--primary)" },
                          "&:focus-visible": { outline: "2px solid var(--primary)", outlineOffset: 2 },
                        }}
                      >
                        {t("floorShort", { floor: floor.level })}
                      </Box>
                    );
                  })}
                </Stack>
              ) : null}

              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  left: 18,
                  bottom: 12,
                  color: palette.overlayMuted,
                  pointerEvents: "none",
                }}
              >
                {t(active.places.length ? "hint" : "hintStairs")}
              </Typography>
            </Box>

            {/* Légende : mêmes couleurs que la maquette */}
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: { xs: 1.5, md: 2.5 }, mt: 2 }}>
              {legendTones.map((tone) => (
                <Stack key={tone} direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <Swatch color={palette.tones[tone]} />
                  <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                    {t(`legend.${tone}`)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="overline" sx={{ color: "var(--primary)" }}>
              {t("onThisFloor")}
            </Typography>
            <Stack component="ul" spacing={1} sx={{ listStyle: "none", p: 0, m: 0, mt: 1.5 }}>
              {active.items.map((item) => {
                const { place } = item;
                const exterior = item.tone === "exterior";
                const hover = exterior
                  ? {}
                  : {
                      onMouseEnter: () => setHoveredKey(item.key),
                      onMouseLeave: () => setHoveredKey(null),
                    };

                if (!place) {
                  return (
                    <Box component="li" key={item.key}>
                      <Box sx={rowSx(item.key, false, item.tone)} {...hover}>
                        <ToneBar color={palette.tones[item.tone]} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {t(`zones.${item.zone}.name`)}
                          </Typography>
                          {zoneTag(item.zone) ? (
                            <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                              {zoneTag(item.zone)}
                            </Typography>
                          ) : null}
                        </Box>
                      </Box>
                    </Box>
                  );
                }

                const isRoom = place.type === "room";
                const meta = [
                  kindLabel(place.kind),
                  isRoom
                    ? place.source.comingSoon
                      ? tRooms("soon")
                      : `${formatKz(place.source.price)} ${tRooms("perNight")}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <Box component="li" key={item.key}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => openPlace(place, active.level)}
                      onFocus={() => setHoveredKey(item.key)}
                      onBlur={() => setHoveredKey(null)}
                      sx={rowSx(item.key, true, item.tone)}
                      {...hover}
                    >
                      <ToneBar color={palette.tones[item.tone]} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>{place.name}</Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                          {meta}
                        </Typography>
                      </Box>
                      <ArrowOutwardIcon sx={{ fontSize: 18, color: "var(--text-faint)" }} />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <PlaceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        place={selected?.place ?? null}
        kicker={selected ? `${kindLabel(selected.place.kind)} · ${floorName(selected.level)}` : ""}
      />
    </Box>
  );
}
