"use client";

import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { useLogin } from "../action/useLogin";

export default function LoginForm() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    loading,
  } = useLogin();

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
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
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