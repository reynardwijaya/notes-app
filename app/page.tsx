"use client";

import { Box, Typography, Button, Stack, Fade, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { FileText, Folder, Search } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      className="bg-landing-hero bg-cover"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3 },
        pt: { xs: 4, sm: 0 },
      }}
    >
      {/* Subtle background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          maxWidth: 600,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* HERO TITLE - Ultra Minimal */}
        <Fade in timeout={800}>
          <Typography
            variant="h1"
            component="h1"
            fontWeight={700}
            sx={{
              color: "text.primary",
              mb: 1.5,
              fontSize: { xs: "2.25rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            NoteBase
          </Typography>
        </Fade>

        {/* MINIMAL SUBTITLE */}
        <Fade in timeout={1000}>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              mb: 6,
              fontWeight: 400,
              lineHeight: 1.5,
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              maxWidth: 400,
              mx: "auto",
            }}
          >
            Clean. Simple. Powerful.
          </Typography>
        </Fade>

        {/* FEATURE PREVIEW - Keep this! */}
        <Fade in timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.6)",
              mb: 5,
              maxWidth: 400,
              mx: "auto",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              {/* Note Card */}
              <Paper
                className="bg-landing-card-note border border-black/5"
                sx={{
                  p: 2,
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={20} className="text-slate-600" />
              </Paper>

              {/* Folder Card */}
              <Paper
                className="bg-landing-card-folder border border-black/5"
                sx={{
                  p: 2,
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  boxShadow: "0 4px 16px rgba(251,191,36,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Folder size={20} className="text-amber-700" />
              </Paper>

              {/* Search Card */}
              <Paper
                className="bg-landing-card-search border border-black/5"
                sx={{
                  p: 2,
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  boxShadow: "0 4px 16px rgba(59,130,246,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={20} className="text-blue-600" />
              </Paper>
            </Stack>
          </Paper>
        </Fade>

        {/* ACTION BUTTONS */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Fade in timeout={1400}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push("/login")}
              sx={{
                px: 4,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                height: 44,
                minWidth: 140,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              Get Started
            </Button>
          </Fade>

          <Fade in timeout={1600}>
            <Button
              variant="text"
              color="inherit"
              size="large"
              onClick={() => router.push("/register")}
              sx={{
                px: 3.5,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "text.secondary",
                height: 44,
                minWidth: 140,
                "&:hover": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                },
                transition: "all 0.2s ease",
              }}
            >
              New Account
            </Button>
          </Fade>
        </Stack>

        {/* TRUST SIGNAL */}
        <Fade in timeout={1800}>
          <Typography
            variant="body2"
            sx={{
              color: "text.disabled",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Join 50K+ creators organizing their ideas
          </Typography>
        </Fade>
      </Box>
    </Box>
  );
}
