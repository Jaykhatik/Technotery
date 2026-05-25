import React, { useState, useEffect } from "react";
import "./Home.css";
import i1 from "../../../Assets/Images/Banner.png";

import { FaLaptop, FaGamepad, FaBath, FaUtensils, FaMagic } from "react-icons/fa";
import axios from "axios";

const Hero = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [categories, setCategories] = useState([]);

  const BASE_URL = "http://192.168.0.3:8000";

  // 👉 Icon Logic
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("electronic")) return <FaLaptop />;
    if (n.includes("gaming")) return <FaGamepad />;
    if (n.includes("bath")) return <FaBath />;
    if (n.includes("kitchen")) return <FaUtensils />;
    return <FaMagic />;
  };

  useEffect(() => {
    axios
      .get("http://192.168.0.3:8000/api/user/products")
      .then((res) => {
        const products = res.data.data;

        // 👉 Unique Categories with Image
        const uniqueCategories = [
          ...new Map(
            products.map((item) => [
              item.category,
              {
                id: item.category,
                name: item.category,
                img: BASE_URL + item.primary_image,
                icon: getIcon(item.category),
              },
            ])
          ).values(),
        ];

        // console.log(uniqueCategories); // ✅ debug

        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.log("API ERROR:", err);
      });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <img src={i1} alt="hero" className="hero-img" />
      </section>

      {/* CATEGORY */}
      <section className="category">
        <h1>Discover, Refresh, Get Inspired</h1>
        <p>
          Explore your favorite categories and find products that perfectly match your style.
        </p>

        <div className="category-grid">
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <div
                className="card"
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img src={item.img} alt={item.name} />

                {/* ICON (on hover) */}
                {hoveredCard === index && (
                  <div className="card-icon">{item.icon}</div>
                )}

                <div className="overlay">
                  <h2>{item.name}</h2>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No Categories Found</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Hero;