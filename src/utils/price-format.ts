export const formatPrice = (value: number) => {
  if (value == null || isNaN(value)) return "";
  return value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};
