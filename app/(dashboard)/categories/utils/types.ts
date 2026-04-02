export type CategoryItem = {
  id: string;
  name: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  created_at: string;
  total_notes: number;
};

export type CategoryUsageRow = {
  title: string | null;
};

export type CategoryUsageResult =
  | {
      success: true;
      count: number;
      titles: string[];
    }
  | {
      error: string;
    };