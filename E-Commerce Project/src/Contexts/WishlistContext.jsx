import React, { createContext, useState, useEffect } from "react";
import ls from "../Utils/secureStorage";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const storedWishlist = ls.get("wishlist");
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch {
      return [];
    }
  });

  // ✅ Save to local storage
  useEffect(() => {
    ls.set("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ✅ Get Product ID (same as cart)
  const getProductId = (product) => {
    return product.id || product._id || product.uuid;
  };

  // ✅ ADD / REMOVE (Toggle)
  const toggleWishlist = (product) => {
    const productId = getProductId(product);

    if (!productId) {
      console.error("Product ID missing ❌", product);
      return;
    }

    setWishlistItems((prev) => {
      const exists = prev.find(
        (item) => getProductId(item) === productId
      );

      if (exists) {
        // ❌ REMOVE
        return prev.filter(
          (item) => getProductId(item) !== productId
        );
      }

      // ✅ ADD
      const newItem = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image || product.primary_image,
      };

      return [...prev, newItem];
    });
  };

  // ✅ CHECK IF IN WISHLIST
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // ✅ REMOVE DIRECTLY
  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.id !== productId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};