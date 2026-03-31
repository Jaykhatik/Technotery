import React from "react";
import "./cta.css";
import Button from "../../components/Buttons/Button";

function CTA() {
  return (
    <section className="cta">
      <div className="cta-container">
        <h1>
          Pellentesque suscipit 
          fringilla libero eu.
        </h1>
        <Button className="cta-btn" text="Get a Demo →"/>

      </div>
    </section>
  );
}

export default CTA;