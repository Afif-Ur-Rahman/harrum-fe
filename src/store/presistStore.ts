import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage/storage";
import { User } from "@/types";
import { Channel } from "@/types/chat";
import { Category } from "@/types/category";

export interface CartItem {
  productId: string;
  name: string;
  description?: string;
  image: string;
  variants: Array<{
    variantId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface AuthState {
  token?: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  channels: Channel[];
  setChannels: (payload: Channel[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  cart: CartItem[];
  addToCart: (item: {
    productId: string;
    description?: string;
    name: string;
    image: string;
    variant: { _id: string; name: string; price: number };
    quantity: number;
  }) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartItemQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const usePersistStore = create<AuthState>()(
  persist(
    (set, get) => {
      return {
        user: null,
        channels: [],
        setUser: (user) => {
          set({ user });
        },
        token: null,
        setToken: (token) => {
          set({ token });
        },
        setChannels: (channels) => set({ channels }),
        categories: [],
        setCategories: (categories) => set({ categories }),
        cart: [],
        addToCart: (item) => {
          const cart = get().cart;
          const existingProductIndex = cart.findIndex(
            (cartItem) => cartItem.productId === item.productId
          );

          if (existingProductIndex > -1) {
            const updatedCart = [...cart];
            const existingVariantIndex = updatedCart[
              existingProductIndex
            ].variants.findIndex((v) => v.variantId === item.variant._id);

            if (existingVariantIndex > -1) {
              updatedCart[existingProductIndex].variants[
                existingVariantIndex
              ].quantity += item.quantity;
            } else {
              updatedCart[existingProductIndex].variants.push({
                variantId: item.variant._id,
                name: item.variant.name,
                price: item.variant.price,
                quantity: item.quantity,
              });
            }
            set({ cart: updatedCart });
          } else {
            set({
              cart: [
                ...cart,
                {
                  productId: item.productId,
                  name: item.name,
                  image: item.image,
                  variants: [
                    {
                      variantId: item.variant._id,
                      name: item.variant.name,
                      price: item.variant.price,
                      quantity: item.quantity,
                    },
                  ],
                },
              ],
            });
          }
        },
        removeFromCart: (productId, variantId) => {
          const cart = get().cart;
          if (variantId) {
            const updatedCart = cart
              .map((item) => {
                if (item.productId === productId) {
                  return {
                    ...item,
                    variants: item.variants.filter(
                      (v) => v.variantId !== variantId
                    ),
                  };
                }
                return item;
              })
              .filter((item) => item.variants.length > 0);
            set({ cart: updatedCart });
          } else {
            set({ cart: cart.filter((item) => item.productId !== productId) });
          }
        },
        updateCartItemQuantity: (productId, variantId, quantity) => {
          const cart = get().cart;
          const updatedCart = cart.map((item) => {
            if (item.productId === productId) {
              return {
                ...item,
                variants: item.variants.map((v) =>
                  v.variantId === variantId ? { ...v, quantity } : v
                ),
              };
            }
            return item;
          });
          set({ cart: updatedCart });
        },
        clearCart: () => set({ cart: [] }),
        getCartTotal: () => {
          return get().cart.reduce(
            (total, item) =>
              total +
              item.variants.reduce((sum, v) => sum + v.price * v.quantity, 0),
            0
          );
        },
      };
    },
    {
      name: "auth",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        categories: state.categories,
        cart: state.cart,
      }),
    }
  )
);
