import TopBarClient from "./TopBarClient";

interface TopBarProps {
  pageTitle: string;
  email?: string;
  role?: "admin" | "user";
}

export default function TopBar(props: TopBarProps) {
  return <TopBarClient {...props} />;
}
