import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import { getProducts } from "../services/cartService";
import CartCard from "../components/Carts/CartCard";
import { getUsers } from "../services/UserServices";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/features/cartSlice";

function Carts() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: loggedUser } = useAuth();

  //redux
  const carts = useSelector((state) => state.carts.carts);
  const dispatch = useDispatch();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getUsers().then((data) => setUsers(data));

    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  };

  // ✅ If not logged in
  if (!loggedUser) {
    return <Navigate to="/login" />;
  }
  // console.log(loggedUser)

  // ✅ User Map
  const userMap = {};
  users.forEach((u) => {
    userMap[u.id] = u.username;
  });

  // ✅ Product Map
  const productMap = {};
  products.forEach((p) => {
    productMap[p.id] = p;
  });

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // ✅ Filter carts for logged-in user only
  const userCarts = carts.filter(
    (cart) => cart.userId === loggedUser.id
  );
  // console.log(userCarts)


  // Remove item

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId, userId: loggedUser.id }))
  }
  //handle quantity
  const handleQuantity = (productId, delta) => {
    dispatch(
      updateQuantity({
        productId,
        userId: loggedUser.id,
        delta,
      })
    );
  };
  return (
    <div className="cart-container">
      <h1 className="title">🛒 Cart Page</h1>
      {userCarts.length === 0 && <h2>No carts available</h2>}

      {userCarts.map((cart) => (
        <CartCard
          key={cart.productId}
          cart={cart}
          userMap={userMap}
          productMap={productMap}
          removeFromCart={handleRemove}
          updateQuantity={handleQuantity}
        />
      ))}
    </div>
  );
}

export default Carts;