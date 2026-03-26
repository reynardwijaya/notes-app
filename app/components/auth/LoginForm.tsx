"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Alert, CircularProgress } from "@mui/material";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      const role = data.user.role;
      setLoading(false);

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/notes");
      }
    } catch (err) {
      console.error("LOGIN CATCH ERROR:", err);
      setError("Login failed");
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={20} /> : "Login"}
        </Button>
      </Box>
    </>
  );
}
