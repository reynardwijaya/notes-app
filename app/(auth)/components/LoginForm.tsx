"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { toast } from "@/lib/toast";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API login
      const res = await fetch("/api/auth-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("LOGIN ERROR RESPONSE:", data);
        toast.error(String(data.error ?? "Login failed"));
        setLoading(false);
        return;
      }
      const role = data.user.role;
      setLoading(false);

      toast.success("Welcome back");
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/notes");
      }
    } catch (err) {
      console.error("LOGIN CATCH ERROR:", err);
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
          maxWidth: 400,
          mx: "auto",
          pb: 2,
        }}
      >
        {/* EMAIL */}
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              bgcolor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0,0,0,0.06)",
              transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              height: 56,
              fontSize: "1rem",
              fontWeight: 500,
              "& fieldset": { border: "none" },
              "&:hover": {
                borderColor: "rgb(59 130 246)",
                boxShadow: "0 8px 25px rgba(59,130,246,0.2)",
                transform: "scale(1.02)",
              },
              "&.Mui-focused": {
                borderColor: "rgb(59 130 246)",
                boxShadow: "0 12px 40px rgba(59,130,246,0.3)",
                bgcolor: "white",
                transform: "scale(1.02) translateY(-1px)",
              },
            },
            "& .MuiInputLabel-root": {
              fontWeight: 600,
              color: "rgb(55 65 81)",
              fontSize: "1rem",
              top: -8,
              letterSpacing: "-0.01em",
              "&.Mui-focused": {
                color: "rgb(59 130 246)",
                fontSize: "0.85rem",
              },
            },
            "& .MuiInputLabel-shrink": {
              transformOrigin: "top left",
              transform: "translate(16px, -12px) scale(0.8)",
              fontSize: "0.85rem",
              fontWeight: 600,
            },
            "& .MuiInputBase-input": {
              padding: "18px 16px 6px 16px",
              fontSize: "1rem",
              fontWeight: 500,
              letterSpacing: "-0.015em",
            },
          }}
        />

        {/* PASSWORD */}
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              bgcolor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0,0,0,0.06)",
              transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              height: 56,
              fontSize: "1rem",
              fontWeight: 500,
              "& fieldset": { border: "none" },
              "&:hover": {
                borderColor: "rgb(59 130 246)",
                boxShadow: "0 8px 25px rgba(59,130,246,0.2)",
                transform: "scale(1.02)",
              },
              "&.Mui-focused": {
                borderColor: "rgb(59 130 246)",
                boxShadow: "0 12px 40px rgba(59,130,246,0.3)",
                bgcolor: "white",
                transform: "scale(1.02) translateY(-1px)",
              },
            },
            "& .MuiInputLabel-root": {
              fontWeight: 600,
              color: "rgb(55 65 81)",
              fontSize: "1rem",
              top: -8,
              letterSpacing: "-0.01em",
              "&.Mui-focused": {
                color: "rgb(59 130 246)",
                fontSize: "0.85rem",
              },
            },
            "& .MuiInputLabel-shrink": {
              transformOrigin: "top left",
              transform: "translate(16px, -12px) scale(0.8)",
              fontSize: "0.85rem",
              fontWeight: 600,
            },
            "& .MuiInputBase-input": {
              padding: "18px 16px 6px 16px",
              fontSize: "1rem",
              fontWeight: 500,
              letterSpacing: "-0.015em",
            },
          }}
        />

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.75,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            height: 54,
            mt: 1,
            boxShadow: loading ? "none" : "0 6px 20px rgba(59,130,246,0.3)",
            bgcolor: loading ? "rgb(203 213 225)" : "rgb(59 130 246)",
            color: "white",
            "&:hover": loading
              ? {}
              : {
                  bgcolor: "rgb(37 99 235)",
                  boxShadow: "0 12px 35px rgba(59,130,246,0.4)",
                  transform: "translateY(-2px)",
                },
            transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Sign In"
          )}
        </Button>
      </Box>
    </>
  );
}
