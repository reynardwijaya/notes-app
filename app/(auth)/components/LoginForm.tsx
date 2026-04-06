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
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
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
        size="medium"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
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
        size="medium"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* BUTTON */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          "Sign In"
        )}
      </Button>
    </Box>
  );
}
