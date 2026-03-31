import React, { useState } from "react";
import "../Task-1/Task.css";

function Task1() {

  const initialCards = [
    { id: 1, name: "John Doe", img: "/imgs/images (4).jpg", info: "Frontend Developer" },
    { id: 2, name: "Jane Smith", img: "/imgs/images (3).jpg", info: "UI Designer" },
    { id: 3, name: "Mike Johnson", img: "/imgs/images (2).jpg", info: "Backend Developer" },
    { id: 4, name: "Sarah Wilson", img: "/imgs/images (1).jpg", info: "Full Stack Developer" }
  ];

  const [leftCards, setLeftCards] = useState(initialCards);
  const [rightCards, setRightCards] = useState([]);
  const [dragItem, setDragItem] = useState(null);

  const data = [
    { column:"left", cards: leftCards},
    { column:"right", cards: rightCards }
  ];

  const handleDragStart = (index, column) => {
    setDragItem({ index, column });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (index, column) => {

    if (!dragItem) return;

    const sourceColumn = dragItem.column;
    const sourceIndex = dragItem.index;

    const sourceList =
      sourceColumn === "left" ? [...leftCards] : [...rightCards];

    const destinationList =
      column === "left" ? [...leftCards] : [...rightCards];

    // SAME COLUMN → SWAP
    if (sourceColumn === column) {

      if (sourceIndex === index) return;
      if (index >= sourceList.length) return;

      const temp = sourceList[sourceIndex];
      sourceList[sourceIndex] = sourceList[index];
      sourceList[index] = temp;

      if (column === "left") setLeftCards(sourceList);
      if (column === "left") setLeftCards(sourceList);
      else setRightCards(sourceList);

    } else {

      // DIFFERENT COLUMN → MOVE
      const [movedCard] = sourceList.splice(sourceIndex, 1);
      destinationList.splice(index, 0, movedCard);

      if (sourceColumn === "left") setLeftCards(sourceList);
      else setRightCards(sourceList);

      if (column === "left") setLeftCards(destinationList);
      else setRightCards(destinationList);
    }

    setDragItem(null);
  };

  return (
    <div className="container">
      {data.map(({ column,cards }) => (
        <div
          key={column}
          className={column}
          onDragOver={allowDrop}
          onDrop={() => handleDrop(cards.length, column)}
        >
          <h2 className="title">users</h2>

          <div className="card-container">
            {cards.map((card, index) => (
              <div
                key={card?.id}
                className="card"
                draggable
                onDragStart={() => handleDragStart(index, column)}
                onDragOver={allowDrop}
                onDrop={(e) => {
                  e.stopPropagation();
                  handleDrop(index, column);
                }}
              >
                <div className="card-left">
                  <img src={card?.img} alt={card?.name} />

                  <div className="card-text">
                    <h3>{card?.name}</h3>
                    <p>{card?.info}</p>
                    <span className="badge">Active</span>
                  </div>
                </div>

                <button className="card-btn">View</button>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}

export default Task1;