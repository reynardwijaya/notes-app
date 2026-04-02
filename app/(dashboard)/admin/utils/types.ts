export interface MostActiveUser {
  id: string;
  email: string;
  total_notes: number;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  role: string;
  total_categories: number;
  total_notes: number;
  created_at: string;
}

export interface AdminTotals {
  total_users: number;
  total_notes: number;
}

export interface AdminDashboardData {
  totals: AdminTotals;
  mostActiveUser: MostActiveUser | null;
  users: AdminUserSummary[];
}
export type AdminUserListRow = {
  id: string;
  email: string;
  role: "user" | "admin";
  total_categories: number;
  total_notes: number;
  created_at: string;
};

