export function buildCategoryColorIndex(
  categories: Array<{ id: string; name: string }>,
) {
  const sorted = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  const byId = new Map<string, number>();

  sorted.forEach((c, idx) => {
    byId.set(c.id, idx);
  });

  return byId;
}
