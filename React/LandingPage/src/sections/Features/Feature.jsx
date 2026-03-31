import React from "react";
import "./feature.css";
import Button from '../../components/Buttons/Button'

function Feature({ img, title, desc, btnText }) {
  return (
    <section className="feature">
      <div className="feature-img">
        <img src={img} alt="feature" />
      </div>
      <div className="feature-content">
        <h2>{title}</h2>
        <p>
          {desc}
        </p>
        <Button className="feature-btn" text={btnText} />
      </div>
    </section>
  );
}

export default Feature;