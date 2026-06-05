export const generateGuestId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOrCreateGuestId = (): string => {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem("guestId");
  if (existing) return existing;
  const newId = generateGuestId();
  localStorage.setItem("guestId", newId);
  return newId;
};
