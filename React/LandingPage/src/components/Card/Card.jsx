import React from "react";
import './card.css'

function Card({ img, icon, title, desc, link, type }) {
    if (type === "blog") {
        return (
            <div className="blog-card">
                <img src={img} alt={title} />

                <div className="blog-content">
                    <p>{title}</p>
                    {link && <a href="#">{link}</a>}
                </div>
            </div>
        );
    }
    // ✅ COMMUNITY CARD
    if (type === "community") {
        const Icon=icon;
        return (
            <div className="community-card">
                <Icon className="community-icon">{icon}</Icon>
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        );
    }


    return null;
}

export default Card;