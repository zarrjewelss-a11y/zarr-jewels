"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<
  WishlistContextType | undefined
>(undefined);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );
    }

    setMounted(true);
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        "Failed to save wishlist:",
        error
      );
    }
  }, [wishlist, mounted]);

  // Add item
  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (
        prev.some(
          (product) => product.id === item.id
        )
      ) {
        return prev;
      }

      return [...prev, item];
    });
  };

  // Remove item
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  // Check item
  const isInWishlist = (id: string) => {
    return wishlist.some(
      (item) => item.id === id
    );
  };

  // Toggle
  const toggleWishlist = (
    item: WishlistItem
  ) => {
    setWishlist((prev) => {
      const exists = prev.some(
        (product) => product.id === item.id
      );

      if (exists) {
        return prev.filter(
          (product) =>
            product.id !== item.id
        );
      }

      return [...prev, item];
    });
  };

  // Clear all
  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(
    WishlistContext
  );

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}