import { colornames as colorNameList } from "color-name-list";

type NamedColor = { name: string; hex: string };

const normalizeColorKey = (color: string) =>
  color
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, " ")
    .trim();

let colorLookup: Map<string, string> | null = null;

const getColorLookup = () => {
  if (!colorLookup) {
    colorLookup = new Map();
    (colorNameList as NamedColor[]).forEach(({ name, hex }) => {
      const key = normalizeColorKey(name);
      if (!colorLookup!.has(key)) colorLookup!.set(key, hex);
    });
  }
  return colorLookup;
};

const findLooseMatch = (key: string, lookup: Map<string, string>) => {
  const words = key.split(" ").filter(Boolean);
  if (words.length === 0) return null;

  for (const [name, hex] of lookup) {
    if (words.every((word) => name.includes(word))) {
      return hex;
    }
  }

  return null;
};

const hashToColor = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 55%)`;
};

const isValidCssColorKeyword = (value: string) => {
  if (typeof window === "undefined" || typeof CSS === "undefined") {
    return false;
  }
  try {
    return CSS.supports("color", value.replace(/\s+/g, ""));
  } catch {
    return false;
  }
};

export const getColorValue = (colorName?: string): string => {
  if (!colorName?.trim()) return "#9ca3af";

  const key = normalizeColorKey(colorName);
  const lookup = getColorLookup();

  if (lookup.has(key)) return lookup.get(key)!;
  if (isValidCssColorKeyword(key)) return key.replace(/\s+/g, "");

  const loose = findLooseMatch(key, lookup);
  if (loose) return loose;

  return hashToColor(key);
};
