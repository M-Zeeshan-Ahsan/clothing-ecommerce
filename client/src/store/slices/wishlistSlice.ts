import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";

interface WishlistState {
  items: Product[];
}

const getInitialWishlist = (): Product[] => {
  try {
    const wishlist = localStorage.getItem("wishlist");

    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
};

const initialState: WishlistState = {
  items: getInitialWishlist(),
};

const saveWishlist = (items: Product[]) => {
  localStorage.setItem("wishlist", JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);

      if (!exists) {
        state.items.push(action.payload);
      }

      saveWishlist(state.items);
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      saveWishlist(state.items);
    },

    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);

      if (exists) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
      } else {
        state.items.push(action.payload);
      }

      saveWishlist(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];

      saveWishlist(state.items);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
