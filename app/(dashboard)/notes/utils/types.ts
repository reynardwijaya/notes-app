export type NoteWithCategory = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  category_name: string;
  created_at: string;
};

export type NoteCategory = {
  id: string;
  name: string;
};

export type NoteSaveInput = {
  title: string;
  content: string;
  categoryId: string;
};

export type NoteSaveResult =
  | { success: true; note: NoteWithCategory }
  | { error: string };

