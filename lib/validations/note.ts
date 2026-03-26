import * as v from "valibot";

export const createNoteSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "Title is required")),
  content: v.pipe(v.string(), v.minLength(1, "Content is required")),
  category_id: v.pipe(v.string(), v.minLength(1, "Category is required")),
});
