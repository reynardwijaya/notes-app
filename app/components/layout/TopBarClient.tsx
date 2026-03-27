"use client";

import { logout } from "@/app/actions/logout";
import { Button } from "@mui/material";

interface TopBarProps {
  pageTitle: string;
  email?: string;
  role?: "admin" | "user";
}

export default function TopBarClient({ pageTitle, email, role }: TopBarProps) {
  return (
    <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      {/* LEFT */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
        <span className="text-sm text-gray-500">
          {role === "admin" ? "Admin Panel" : "Your personal notes"}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER INFO */}
        <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700">
          {email ? (
            <>
              <span className="font-medium">{email}</span>{" "}
              <span className="text-gray-500">
                ({role === "admin" ? "Admin" : "User"})
              </span>
            </>
          ) : (
            <span className="animate-pulse text-gray-400">Loading...</span>
          )}
        </div>

        {/* LOGOUT */}
        <form action={logout}>
          <Button type="submit" variant="contained" color="error" size="small">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
