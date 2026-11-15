"use client";

import dynamic from "next/dynamic";
import { Fragment, useCallback, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { FLOOR_PALETTES } from "@/components/home/floorPlan/palette";
import { useThemeMode } from "@/components/providers/ThemeModeProvider";
import { buildFloorsFromDatabase } from "@/lib/floorPlan";

const FloorPlanCanvas = dynamic(() => import("@/components/home/floorPlan/FloorPlanCanvas"), {
  ssr: false,
});

function cellMapForFloor(floor) {
  const map = new Map();
  for (const cell of floor.db?.cells ?? []) {
    map.set(`${cell.grid_x},${cell.grid_y}`, cell);
  }
  return map;
}

function zoneByUid(floor) {
  return new Map((floor.db?.zones ?? []).map((z) => [z.uid, z]));
}

function DbGrid({ floor, palette }) {
  const cols = floor.db?.cols ?? floor.cols;
  const rows = floor.db?.rows ?? floor.rows;
  const cells = cellMapForFloor(floor);
  const zones = zoneByUid(floor);

  return (
    <Box sx={{ overflow: "auto" }}>
      <Box
        sx={{
          display: "inline-grid",
          gridTemplateColumns: `36px repeat(${cols}, minmax(52px, 1fr))`,
          gap: "4px",
          alignItems: "stretch",
        }}
      >
        <Box />
        {Array.from({ length: cols }, (_, i) => (
          <Typography key={`x-${i}`} variant="caption" align="center" color="text.secondary">
            {i + 1}
          </Typography>
        ))}

        {Array.from({ length: rows }, (_, rowIndex) => {
          const gridY = rows - rowIndex;
          return (
            <Fragment key={`row-${gridY}`}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ alignSelf: "center", textAlign: "right", pr: 0.5 }}
              >
                {gridY}
              </Typography>
              {Array.from({ length: cols }, (_, colIndex) => {
                const gridX = colIndex + 1;
                const cell = cells.get(`${gridX},${gridY}`);
                const zone = cell ? zones.get(cell.uid_zone) : null;
                const fill =
                  cell?.color_override ||
                  zone?.color ||
                  (zone ? palette.tones.room : palette.tones.corridor);
                const title = zone?.label || zone?.entity?.name || "";
                return (
                  <Box
                    key={`${gridX}-${gridY}`}
                    title={title ? `${title} (${gridX}/${gridY})` : `${gridX}/${gridY}`}
                    sx={{
                      minHeight: 52,
                      borderRadius: 1,
                      border: "1px solid var(--border-strong)",
                      bgcolor: fill,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 0.5,
                      textAlign: "center",
                    }}
                  >
                    {title ? (
                      <Typography variant="caption" sx={{ fontSize: 10, lineHeight: 1.2 }}>
                        {title}
                      </Typography>
                    ) : null}
                  </Box>
                );
              })}
            </Fragment>
          );
        })}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        Origine 1/1 en bas à gauche — axe X horizontal, Y vertical.
      </Typography>
    </Box>
  );
}

/**
 * @param {{ payload: { floors?: object[], floors_count?: number } | null }} props
 */
export default function HousePlanTestPage({ payload }) {
  const { resolvedMode } = useThemeMode();
  const palette = FLOOR_PALETTES[resolvedMode === "dark" ? "dark" : "light"];

  const built = useMemo(
    () => buildFloorsFromDatabase({ floors: payload?.floors ?? [] }),
    [payload],
  );

  const [tab, setTab] = useState(0);
  const active = built[tab] ?? built[0];

  const zoneLabel = useCallback((floor, areaKey) => {
    const uid = String(areaKey ?? "").replace(/^zone:/, "");
    const zone = (floor.db?.zones ?? []).find((z) => z.uid === uid);
    return zone?.label || zone?.entity?.name || zone?.type || "";
  }, []);

  const buildFloorTexts = useCallback(
    (floor) => {
      const map = {};
      for (const area of floor.areas) {
        if (area.kind === "place") {
          const place = floor.places.find((p) => p.id === area.placeId);
          if (place) map[area.key] = { title: place.shortName || place.name, subtitle: place.kind };
        } else if (area.kind === "zone") {
          map[area.key] = { title: zoneLabel(floor, area.key), subtitle: area.zone || "" };
        } else if (area.kind === "stairs") {
          map[area.key] = { title: "Escalier", subtitle: "" };
        }
      }
      return map;
    },
    [zoneLabel],
  );

  const canvasFloors = useMemo(
    () => built.map((floor) => ({ ...floor, stairsTarget: null, texts: buildFloorTexts(floor) })),
    [built, buildFloorTexts],
  );

  const handleTab = useCallback((_, value) => setTab(value), []);

  if (!built.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Test plan maison (BDD)
        </Typography>
        <Typography color="text.secondary">
          Aucun étage trouvé dans `houses_floors` pour cette maison, ou l’endpoint n’est pas encore déployé.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h4" component="h1">
            Test plan maison (BDD)
          </Typography>
          <Chip label="temporaire" size="small" color="warning" variant="outlined" />
        </Stack>
        <Typography color="text.secondary" maxWidth={720}>
          Données `houses_floors`, `houses_floor_zones`, `houses_floor_cells`. La grille 2D respecte le
          repère 1/1 en bas à gauche ; la vue 3D réutilise le moteur de la page d’accueil.
        </Typography>
        <Tabs value={tab} onChange={handleTab} variant="scrollable" allowScrollButtonsMobile>
          {built.map((floor, index) => (
            <Tab
              key={floor.level}
              value={index}
              label={`${floor.name || `Étage ${floor.level}`} (niv. ${floor.level})`}
            />
          ))}
        </Tabs>
      </Stack>

      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Grille 2D — {active.name || `niveau ${active.level}`}
          </Typography>
          <DbGrid floor={active} palette={palette} />
        </Box>

        <Box
          sx={{
            borderRadius: 3,
            border: "1px solid var(--border-strong)",
            overflow: "hidden",
            minHeight: { xs: 360, md: 480 },
            bgcolor: palette.background,
          }}
        >
          <FloorPlanCanvas
            floors={canvasFloors}
            activeLevel={active.level}
            palette={palette}
            mode={resolvedMode === "dark" ? "dark" : "light"}
            highlightKey={null}
            running={false}
            animate={false}
            onSelectPlace={() => {}}
            onSelectFloor={() => {}}
            onHover={() => {}}
          />
        </Box>

        <Box component="details">
          <summary style={{ cursor: "pointer" }}>JSON brut (étage actif)</summary>
          <Box
            component="pre"
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              fontSize: 12,
              overflow: "auto",
              maxHeight: 320,
            }}
          >
            {JSON.stringify(active.db, null, 2)}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}