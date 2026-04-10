export const CATEGORY_STYLES = [
  {
    bg: "!bg-category-blue-bg",
    text: "!text-category-blue-text",
    border: "!border-category-blue-border",
  },
  {
    bg: "!bg-category-green-bg",
    text: "!text-category-green-text",
    border: "!border-category-green-border",
  },
  {
    bg: "!bg-category-orange-bg",
    text: "!text-category-orange-text",
    border: "!border-category-orange-border",
  },
  {
    bg: "!bg-category-purple-bg",
    text: "!text-category-purple-text",
    border: "!border-category-purple-border",
  },
  {
    bg: "!bg-category-pink-bg",
    text: "!text-category-pink-text",
    border: "!border-category-pink-border",
  },
  {
    bg: "!bg-category-cyan-bg",
    text: "!text-category-cyan-text",
    border: "!border-category-cyan-border",
  },
];

export function getCategoryStyle(index: number) {
  const safe = Number.isFinite(index) ? index : 0;
  return CATEGORY_STYLES[
    ((safe % CATEGORY_STYLES.length) + CATEGORY_STYLES.length) %
      CATEGORY_STYLES.length
  ];
}
