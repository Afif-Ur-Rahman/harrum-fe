import { MenuType } from "@/types/menu";
import { create } from "zustand";

interface MenuStoreState {
  menuData: MenuType[];
  setMenuData: (menuData: MenuType[]) => void;

  categories: { _id: string; title: string; sequence: number }[];
  setCategories: (
    categories: { _id: string; title: string; sequence: number }[],
  ) => void;

  latitude: number | undefined;
  longitude: number | undefined;
  setLocation: (lat: number, lng: number) => void;

  restaurantId: string | undefined;
  setRestaurantId: (id: string | undefined) => void;

  outsideRestaurant: boolean;
  setOutsideRestaurant: (val: boolean) => void;
}

export const useMenuStore = create<MenuStoreState>((set) => ({
  menuData: [],
  categories: [],

  latitude: undefined,
  longitude: undefined,
  restaurantId: undefined,
  outsideRestaurant: false,

  setMenuData: (menuData) => set({ menuData }),
  setCategories: (categories) => set({ categories }),
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  setRestaurantId: (id) => set({ restaurantId: id }),
  setOutsideRestaurant: (val) => set({ outsideRestaurant: val }),
}));
