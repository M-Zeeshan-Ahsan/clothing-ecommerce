import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../data/products";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const getInitialCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem("cart");

    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: getInitialCart(),
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );

      saveCart(state.items);
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload,
      );

      if (item) {
        item.quantity += 1;
      }

      saveCart(state.items);
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload,
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.product.id !== action.payload,
          );
        }
      }

      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];

      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
