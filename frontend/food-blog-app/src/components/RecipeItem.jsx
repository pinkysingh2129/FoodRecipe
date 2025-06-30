import React from "react";
import fooding from "/src/assets/food5.jpg";
import { BiStopwatch } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";

export default function RecipeItem({ recipes }) {
  console.log("Received Recipes in RecipeItem:", recipes);

  if (!Array.isArray(recipes) || recipes.length === 0) {
    return <div className="text-center">No recipes found.</div>;
  }

  return (
    <div className="card-container">
      {recipes.map((item, index) => (
        <div key={index} className="card">
          <img
  src={item.coverImage ? `http://localhost:5000/uploads/${item.coverImage}` : fooding}
  width="120px"
  height="100px"
  alt="food image"
/>
<div className="card-body">
            <div className="title">{item.title || "Untitled Recipe"}</div>
            <div className="icons">
              <div className="timer">
                <BiStopwatch /> {item.time || "N/A"}
              </div>
              <IoIosHeart />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
