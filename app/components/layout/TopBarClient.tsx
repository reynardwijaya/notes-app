"use client";

import { logout } from "@/app/actions/logout";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { useTransition } from "react";

interface TopBarProps {
  pageTitle: string;
  email?: string;
  role?: "admin" | "user";
}

export default function TopBarClient({ pageTitle, email, role }: TopBarProps) {
  const [isPending] = useTransition();

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
      {/* LEFT */}
      <div className="flex flex-col space-y-0.5">
        <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {role === "admin" ? "Admin" : "Notes"}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* USER INFO */}
        <div className="flex items-center gap-2.5 pr-1">
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              fontSize: '0.875rem',
              bgcolor: role === "admin" ? '#1e40af' : '#0ea5e9',
              fontWeight: 600
            }}
            alt={email?.split('@')[0] || ''}
          >
            {email?.charAt(0).toUpperCase() || ''}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900 truncate max-w-[140px]">
              {email?.split('@')[0] || 'Loading...'}
            </span>
            <span className="text-xs text-slate-400">
              {role === "admin" ? "Admin" : "User"}
            </span>
          </div>
        </div>

        {/* LOGOUT */}
        <form 
          action={logout}
          className="transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            type="submit" 
            variant="contained" 
            size="small"
            disabled={isPending}
            sx={{
              minWidth: 'auto',
              width: 72,
              height: 32,
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: '#ef4444',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              '&:hover': {
                bgcolor: '#dc2626',
                boxShadow: '0 4px 12px rgba(239,68,68,0.4), 0 2px 4px rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)'
              },
              '&:disabled': {
                bgcolor: '#f3f4f6',
                color: '#9ca3af'
              }
            }}
          >
            {isPending ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Logout'
            )}
          </Button>
        </form>
      </div>
    </header>
  );
}