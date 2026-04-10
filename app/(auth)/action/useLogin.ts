"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("LOGIN ERROR RESPONSE:", data);
        toast.error(String(data.error ?? "Login failed"));
        return;
      }

      const role = data.user.role;

      toast.success("Login Successful");

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/notes");
      }
    } catch (err) {
      console.error("LOGIN CATCH ERROR:", err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    loading,
  };
}