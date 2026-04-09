import React, { useState } from "react";
import "./Home.css";
import i1 from '../../Assets/Images/Image1.avif'
import c1 from '../../Assets/Images/C1.avif'
import c2 from '../../Assets/Images/C2.avif'
import c3 from '../../Assets/Images/C3.avif'

import { FaLaptop, FaGamepad, FaBath, FaUtensils, FaMagic } from "react-icons/fa";

const categories = [
  { id: 1, name: "Electronics & Gadgets", img: c1, icon: <FaLaptop /> },
  { id: 2, name: "Gaming", img: c2, icon: <FaGamepad /> },
  { id: 3, name: "Banheiro", img: c3, icon: <FaBath /> },
  { id: 4, name: "Cozinha", img: c1, icon: <FaUtensils /> },
  { id: 5, name: "Decore", img: c1, icon: <FaMagic /> },
];

const Hero = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <img src={i1} alt="hero" className="hero-img" />

        <div className="hero-content">
          <h1>HOME DECOR</h1>
          <p>
            Achadinhos que transformam sua casa em lar. <br />
            Decoração charmosa, prática e com a sua cara.
          </p>
          <button className="btn">COMPRAR</button>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="category">
        <h1>Decore, renove, inspire-se</h1>
        <p>
          Escolha sua categoria favorita e encontre achadinhos que combinam com você.
        </p>

        <div className="category-grid">
          {categories.map((item) => (
            <div
              className="card"
              key={item.id}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={item.img} alt={item.name} />

              {/* ICON (on hover) */}
              {hoveredCard === item.id && (
                <div className="card-icon">
                  {item.icon}
                </div>
              )}

              <div className="overlay">
                <h2>{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;