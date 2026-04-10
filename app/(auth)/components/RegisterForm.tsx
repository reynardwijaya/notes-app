"use client";

import { TextField, Button, Box } from "@mui/material";
import { useRegister } from "../action/useRegister";

export default function RegisterForm() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleRegister,
    loading,
  } = useRegister();

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
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
        {loading ? "Loading..." : "Create Account"}
      </Button>
    </Box>
  );
}