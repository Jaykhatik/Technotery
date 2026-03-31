import React from "react";
import "./blog.css";
import { blogData } from "../../components/data/data";
import Card from "../../components/Card/Card";
function Blog() {
  return (
    <section className="blog">

      <h2>Caring is the new marketing</h2>
      <p className="blog-subtitle">
        The Nexcent blog is the best place to read about the latest insights.
      </p>
      <div className="blog-cards">
        {blogData.map((item, index) => (
          <Card key={index} {...item} type="blog" />
        ))}
      </div>
    </section>
  );
}

export default Blog;