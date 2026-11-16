import { Box, Container, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { getLegalContent } from "@/lib/legal/content";

/**
 * @param {{ locale: string, kind: "terms" | "privacy" }} props
 */
export default function LegalDocumentPage({ locale, kind }) {
  const content = getLegalContent(locale, kind);
  if (!content) return null;

  const otherKind = kind === "terms" ? "privacy" : "terms";
  const otherHref = otherKind === "terms" ? "/legal/terms" : "/legal/privacy";
  const otherLabel = otherKind === "terms" ? content.relatedTerms : content.relatedPrivacy;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 }, pb: { xs: 8, md: 12 } }}>
      <Typography variant="overline" sx={{ color: "var(--primary)", letterSpacing: "0.12em" }}>
        DANDELA House
      </Typography>
      <Typography component="h1" variant="h3" sx={{ mt: 1, mb: 0.5, fontWeight: 700, letterSpacing: "-0.02em" }}>
        {content.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--text-muted)", mb: 3 }}>
        {content.updated}
      </Typography>

      <Box
        sx={{
          p: 2.25,
          mb: 4,
          borderRadius: 2,
          border: "1px dashed var(--border-strong)",
          bgcolor: "var(--surface)",
        }}
      >
        <Typography variant="body2" sx={{ color: "var(--text-muted)", lineHeight: 1.65 }}>
          {content.platformNote}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 1.25, color: "var(--text-faint)" }}>
          {content.disclaimer}
        </Typography>
      </Box>

      <Typography sx={{ mb: 4, lineHeight: 1.75, fontSize: "1.05rem" }}>{content.intro}</Typography>

      <Stack component="article" spacing={4}>
        {content.sections.map((section) => (
          <Box key={section.title}>
            <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              {section.title}
            </Typography>
            <Stack spacing={1.25} component="ul" sx={{ m: 0, pl: 2.25 }}>
              {section.paragraphs.map((paragraph) => (
                <Typography
                  key={paragraph}
                  component="li"
                  sx={{ color: "var(--text)", lineHeight: 1.75, pl: 0.5 }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mt: 6,
          pt: 3,
          borderTop: "1px solid var(--border)",
          alignItems: { sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Link
          href={otherHref}
          style={{
            color: "var(--primary)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {otherLabel} ↗
        </Link>
        <Link
          href="/"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: 15,
          }}
        >
          {content.backHome}
        </Link>
      </Stack>
    </Container>
  );
}