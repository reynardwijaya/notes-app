"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import { toast } from "@/lib/toast";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your email for reset link!");
    } catch (err) {
      console.error("RESET PASSWORD ERROR:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    handleReset,
    loading,
  };
}