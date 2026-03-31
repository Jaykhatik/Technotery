import React from "react";
import "./testimonial.css";
import { FaDribbble, FaEye, FaRocket, FaPalette, FaLink } from "react-icons/fa";
import images from "../../assets/images/indexImg";

function Testimonial() {
  return (
    <section className="testimonial-wrapper">
      <div className="testimonial">
        {/* Image */}
        <div className="testimonial-img">
          <img src={images.Testimonial.Testimonial_Image_1} alt="testimonial" />
        </div>

        {/* Content */}
        <div className="testimonial-content">

          <p className="testimonial-text">
           " Maecenas dignissim justo eget nulla rutrum molestie. Maecenas lobortis sem dui, vel
            rutrum risus tincidunt ullamcorper. Proin eu enim metus. Vivamus sed libero ornare,
            tristique quam in, gravida enim. Nullam ut molestie arcu, at hendrerit elit. Morbi laoreet
            elit at ligula molestie, nec molestie mi blandit. Suspendisse cursus tellus sed augue ultrices, quis
            tristique nulla sodales. Suspendisse eget lorem eu turpis vestibulum pretium. Suspendisse potenti.
            Quisque malesuada enim sapien, vitae placerat ante feugiat eget. Quisque vulputate odio neque, eget
            efficitur libero condimentum id. Curabitur id nibh id sem dignissim finibus ac sit amet magna. "
          </p>

          <div className="testimonial-author">
            <h4>Tim Smith</h4>
            <span>British Dragon Boat Racing Association</span>
          </div>

          <div className="testimonial-footer">
            <div className="testimonial-logos">
              <FaDribbble />
              <FaEye />
              <FaRocket />
              <FaPalette />
              <FaLink />
            </div>

            <a href="#">Meet all customers →</a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Testimonial;