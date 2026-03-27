import { ReactNode } from "react";
import TopBar from "./TopBar";

interface Props {
  children: ReactNode;
  pageTitle: string;
  userEmail?: string;
  role?: "admin" | "user";
}

export default function AppLayout({
  children,
  pageTitle,
  userEmail,
  role = "user",
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar pageTitle={pageTitle} email={userEmail} role={role} />
      <main className="p-6">{children}</main>
    </div>
  );
}
