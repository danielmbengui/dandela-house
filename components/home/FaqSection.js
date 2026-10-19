"use client";

import { useState } from "react";
import { Box, Collapse, Container, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

function Item({ index, question, answer, open, onToggle }) {
  return (
    <Box
      component="div"
      sx={{ borderTop: "1px solid var(--border)", "&:last-of-type": { borderBottom: "1px solid var(--border)" } }}
    >
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: { xs: 2.25, md: 2.75 },
          px: 0,
          border: 0,
          bgcolor: "transparent",
          color: "var(--font-color)",
          cursor: "pointer",
          textAlign: "left",
          font: "inherit",
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: "var(--primary)", width: 36, flexShrink: 0 }}
        >
          {String(index + 1).padStart(2, "0")}
        </Typography>
        <Typography
          className="font-serif"
          sx={{ flex: 1, fontSize: { xs: "1.35rem", md: "1.7rem" }, lineHeight: 1.2 }}
        >
          {question}
        </Typography>
        <AddRoundedIcon
          sx={{
            color: "var(--primary)",
            transition: "transform 320ms cubic-bezier(.22,1,.36,1)",
            transform: open ? "rotate(45deg)" : "none",
          }}
        />
      </Box>
      <Collapse in={open}>
        <Typography
          sx={{
            color: "var(--text-muted)",
            maxWidth: 680,
            pl: { xs: 0, sm: "52px" },
            pb: 2.75,
            lineHeight: 1.7,
          }}
        >
          {answer}
        </Typography>
      </Collapse>
    </Box>
  );
}

export default function FaqSection() {
  const t = useTranslations("home.faq");
  const items = t.raw("items");
  const [open, setOpen] = useState(0);

  return (
    <Box component="section" id="faq" className="section-anchor" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 4, md: 6 }}>
          <SectionHeading index="07" kicker={t("kicker")} title={t("title")} />
          <Reveal>
            <Box>
              {items.map((item, i) => (
                <Item
                  key={item.q}
                  index={i}
                  question={item.q}
                  answer={item.a}
                  open={open === i}
                  onToggle={() => setOpen((current) => (current === i ? -1 : i))}
                />
              ))}
            </Box>
          </Reveal>
        </Stack>
      </Container>
    </Box>
  );
}
