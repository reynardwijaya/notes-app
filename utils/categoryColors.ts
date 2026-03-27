export type PastelColor = {
  bg: string;
  text: string;
  border: string;
};

const PASTELS: PastelColor[] = [
  { bg: "#E8F1FF", text: "#1E3A8A", border: "#C7DBFF" }, // blue
  { bg: "#EAFBF2", text: "#166534", border: "#C7F2D9" }, // green
  { bg: "#FFF4E6", text: "#9A3412", border: "#FFE0B7" }, // orange
  { bg: "#F3E8FF", text: "#6B21A8", border: "#E2D0FF" }, // purple
  { bg: "#FFEAF2", text: "#9D174D", border: "#FFD0E0" }, // pink
  { bg: "#E9FBFF", text: "#155E75", border: "#C5F3FF" }, // cyan
];

export function getPastelByIndex(index: number): PastelColor {
  const safe = Number.isFinite(index) ? index : 0;
  return PASTELS[((safe % PASTELS.length) + PASTELS.length) % PASTELS.length]!;
}

export function buildCategoryColorIndex(categories: Array<{ id: string; name: string }>) {
  const sorted = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  const byId = new Map<string, number>();
  sorted.forEach((c, idx) => {
    byId.set(c.id, idx);
  });

  return byId;
}

