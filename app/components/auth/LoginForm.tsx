"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
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
