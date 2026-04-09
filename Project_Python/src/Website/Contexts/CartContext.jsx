import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // ✅ Load from localStorage (better way)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem("cart");
            return storedCart ? JSON.parse(storedCart) : [];
        } catch {
            return [];
        }
    });

    // ✅ Save to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // ✅ Get unique product ID (VERY IMPORTANT)
    const getProductId = (product) => {
        return product.id || product._id || product.uuid;
    };

    // ✅ ADD TO CART (FIXED)
    const addToCart = (product) => {
        const productId = getProductId(product);

        if (!productId) {
            console.error("Product ID missing ❌", product);
            return;
        }

        const quantity = product.quantity && product.quantity > 0 ? product.quantity : 1;

        setCartItems((prev) => {
            const existingItem = prev.find(
                (item) => getProductId(item) === productId
            );

            if (existingItem) {
                return prev.map((item) =>
                    getProductId(item) === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // ✅ Normalize product (BEST PRACTICE)
            const newItem = {
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image || product.primary_image,
                quantity: quantity,
            };

            return [...prev, newItem];
        });
    };

    // ✅ REMOVE
    const removeFromCart = (productId) => {
        setCartItems((prev) =>
            prev.filter((item) => getProductId(item) !== productId)
        );
    };

    // ✅ UPDATE QUANTITY
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prev) =>
            prev.map((item) =>
                getProductId(item) === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };
    // ✅ CLEAR
    const clearCart = () => {
        setCartItems([]);
    };

    // ✅ TOTAL ITEMS
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // ✅ TOTAL PRICE
    const getTotalPrice = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
