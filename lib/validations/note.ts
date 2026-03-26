import * as v from "valibot";

export const createNoteSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "Title is required")),
  content: v.optional(v.string()),
  category_id: v.optional(v.string()),
});
