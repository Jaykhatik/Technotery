import React from "react";
import "./client.css";
import images from "../../assets/images/indexImg";

function Client() {
   const logos = Object.values(images.Clients);

  return (
    <section className="clients">
      <h2>Our Clients</h2>
      <p>We have been working with some Fortune 500+ clients</p>

       <div className="logo-slider">
        <div className="logo-track">
          {[...logos, ...logos].map((logo, index) => (
            <img key={index} src={logo} alt={`logo-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Client;