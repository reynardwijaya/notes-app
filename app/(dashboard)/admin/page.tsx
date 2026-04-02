import AppLayout from "@/app/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import { getAdminDashboardData } from "./utils/getDashboard";
import DashboardContent from "./components/dashboardContent";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch dashboard data
  const dashboardData = await getAdminDashboardData();

  return (
    <AppLayout
      pageTitle="Admin Dashboard"
      userEmail={user?.email ?? ""}
      role="admin"
    >
      <DashboardContent data={dashboardData} userEmail={user?.email ?? ""} />
    </AppLayout>
  );
}
