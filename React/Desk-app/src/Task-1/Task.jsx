import React, { useState } from "react";
import "../Task-1/Task.css";

function Task() {

  const initialCards = [
    { id: 1, name: "John Doe", img: "/imgs/images (4).jpg", info: "Frontend Developer" },
    { id: 2, name: "Jane Smith", img: "/imgs/images (3).jpg", info: "UI Designer" },
    { id: 3, name: "Mike Johnson", img: "/imgs/images (2).jpg", info: "Backend Developer" },
    { id: 4, name: "Sarah Wilson", img: "/imgs/images (1).jpg", info: "Full Stack Developer" }
  ];

  const [columns, setColumns] = useState({
    left: initialCards,
    right: []
  });

  const [dragItem, setDragItem] = useState(null);//which card is curretly dragged

  const handleDragStart = (index, column) => {//it tells when we drag the card that which position or index it should move
    setDragItem({ index, column });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index, column) => {

    if (!dragItem) return;

    const sourceColumn = dragItem.column;
    const sourceIndex = dragItem.index;

    const newColumns = { ...columns };

    const sourceList = [...newColumns[sourceColumn]];
    const destinationList = [...newColumns[column]];

    // SAME COLUMN → SWAP
    if (sourceColumn === column) {

      const temp = sourceList[sourceIndex];
      sourceList[sourceIndex] = sourceList[index];
      sourceList[index] = temp;

      newColumns[column] = sourceList;

    } else {

      // DIFFERENT COLUMN → MOVE
      const [movedCard] = sourceList.splice(sourceIndex, 1);
      destinationList.splice(index, 0, movedCard);

      newColumns[sourceColumn] = sourceList;
      newColumns[column] = destinationList;
    }

    setColumns(newColumns);
    setDragItem(null);
  };

  return (
    <div className="container">

      {/* LEFT SIDE */}
      <div
        className="left"
        onDragOver={allowDrop}
        onDrop={() => handleDrop(columns.left.length, "left")}//This allows dropping at the end of the column.//It gets added to the bottom.
      >
        <h2 className="title">Users</h2>

        <div className="card-container">
          {columns.left.map((card, index) => (
            <div
              key={card?.id}
              className="card"
              draggable//enables drag functionality in html5
              onDragStart={() => handleDragStart(index, "left")}//when dragging start
              onDragOver={allowDrop}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(index, "left");
              }}//This prevents event bubbling.//card drop → column drop → card goes to end//So this ensures correct card position detection.
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


      {/* RIGHT SIDE */}
      <div
        className="right"
        onDragOver={allowDrop}
        onDrop={() => handleDrop(columns.right.length, "right")}
      >
        <h2 className="title">Selected Users</h2>

        <div className="card-container">
          {columns.right.map((card, index) => (
            <div
              key={card?.id}
              className="card"
              draggable
              onDragStart={() => handleDragStart(index, "right")}
              onDragOver={allowDrop}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(index, "right");
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

    </div>
  );
}

export default Task;