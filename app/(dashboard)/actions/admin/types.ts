export type AdminDashboardTotals = {
  total_users: number;
  total_notes: number;
};

export type MostActiveUserRow = {
  user_id: string;
  total_notes: number;
};

export type MostActiveUser = {
  user_id: string;
  email: string;
  total_notes: number;
};

export type AdminUserListRow = {
  id: string;
  email: string;
  role: "user" | "admin";
  total_categories: number;
  total_notes: number;
  created_at: string;
};

