let audio: HTMLAudioElement | null = null;

export const initNotificationSound = (
  src: string = "/audio/notification.mp3",
  volume: number = 0.7
) => {
  if (typeof window === "undefined") return;

  audio = new Audio(src);
  audio.volume = volume;
};

export const playNotificationSound = () => {
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
};
