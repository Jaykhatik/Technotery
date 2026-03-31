import React, { useEffect, useState } from "react";
import "./hero.css";
import Button from "../../components/Buttons/Button";
import images from "../../assets/images/indexImg";

const slides = [
  {
    title: "Lessons and insights",
    highlight: "from 8 years",
    desc: "Where to grow your business as a photographer: site or social media?",
    img: images.Slider.Hero_Image_1,
  },
  {
    title: "Grow your business",
    highlight: "with smart tools",
    desc: "Use analytics and automation to scale your workflow.",
    img:  images.Slider.Hero_Image_2,
  },
  {
    title: "Build your brand",
    highlight: "with confidence",
    desc: "Create a strong online presence and reach more customers.",
    img:  images.Slider.Hero_Image_3,
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [current]);

  // Next Slide
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Prev Slide
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <div className="hero">
      <div
        className="hero-slider"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="hero-slide" key={index}>
            <div className="hero-content">
              <h1>
                {slide.title} <br />
                <span>{slide.highlight}</span>
              </h1>
              <p>{slide.desc}</p>
              <Button className="hero-btn" text="Register"/>
            </div>

            <div className="hero-image">
              <img src={slide.img} alt="hero" />
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {/* <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button> */}

      {/* Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={current === index ? "active" : ""}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Hero;