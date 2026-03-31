import React from "react";
import "./community.css";
import { communityData } from "../../components/data/data";
import Card from "../../components/Card/Card";

function Community() {
  return (
    <section className="community">
      <h2>
        Manage your entire community <br />
        in a single system
      </h2>
      <p>Who is Nexcent suitable for?</p>

      <div className="community-cards">
        
        {
          communityData.map((item,index)=>(
            <Card key={index}{...item} type="community"/>
          ))
        }
      </div>
    </section>
  );
}

export default Community;