"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { normalizeId } from "../app/utils/normalize";

export interface CartItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  flavour: string[];
  sideDish: string[];
  cuisine: string;
  imageUrl?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (
    productId: string,
    flavour?: string[],
    sideDish?: string[]
  ) => void;
  clearCart: () => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    flavour?: string[],
    sideDish?: string[]
  ) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "myCart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsed: CartItem[] = JSON.parse(storedCart);
        setCartItems(parsed.filter((item) => item.productId));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    if (!item.productId) {
      console.error("Cannot add cart item without productId", item);
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find(
        (i) =>
          normalizeId(i.productId) === normalizeId(item.productId) &&
          JSON.stringify(i.flavour.sort()) ===
            JSON.stringify(item.flavour.sort()) &&
          JSON.stringify(i.sideDish.sort()) ===
            JSON.stringify(item.sideDish.sort())
      );

      if (exists) {
        return prev.map((i) =>
          i === exists ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (
    productId: string,
    flavour?: string[],
    sideDish?: string[]
  ) => {
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          !(
            normalizeId(i.productId) === normalizeId(productId) &&
            (!flavour ||
              JSON.stringify(i.flavour.sort()) ===
                JSON.stringify(flavour.sort())) &&
            (!sideDish ||
              JSON.stringify(i.sideDish.sort()) ===
                JSON.stringify(sideDish.sort()))
          )
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (
    productId: string,
    quantity: number,
    flavour?: string[],
    sideDish?: string[]
  ) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (
          normalizeId(i.productId) === normalizeId(productId) &&
          (!flavour ||
            JSON.stringify(i.flavour.sort()) ===
              JSON.stringify(flavour.sort())) &&
          (!sideDish ||
            JSON.stringify(i.sideDish.sort()) ===
              JSON.stringify(sideDish.sort()))
        ) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
