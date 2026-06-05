

type TimePair = {
  open: string;
  close: string;
};

export type DaySchedule = {
  day: string;          
  enabled: boolean;
  times: TimePair;
};

export type RestaurantProfile = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  openingHours?: DaySchedule[];
};
