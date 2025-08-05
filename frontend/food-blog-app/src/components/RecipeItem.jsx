import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import fooding from "/src/assets/food5.jpg";
import { BiStopwatch } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";

export default function RecipeItem({
  recipes,
  onDelete,
  isFavPage = false,
  setRecipes,
  onEdit,
}) {
  const location = useLocation();
  const [favItems, setFavItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const favKey = user ? `fav_${user._id || user.email}` : "fav_guest";

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem(favKey)) ?? [];
    setFavItems(storedFavs);
  }, [location.pathname, favKey]);

  const favRecipe = (item) => {
    const alreadyFav = favItems.some((recipe) => recipe._id === item._id);
    const updatedFavs = alreadyFav
      ? favItems.filter((recipe) => recipe._id !== item._id)
      : [...favItems, item];

    localStorage.setItem(favKey, JSON.stringify(updatedFavs));
    setFavItems(updatedFavs);
  };

  const handleDelete = (id) => {
    if (isFavPage) {
      const updatedFavs = favItems.filter((recipe) => recipe._id !== id);
      localStorage.setItem(favKey, JSON.stringify(updatedFavs));
      setFavItems(updatedFavs);
      if (setRecipes) setRecipes(updatedFavs);
    }
    if (onDelete) onDelete(id);
  };

  if (!Array.isArray(recipes) || recipes.length === 0) {
    return <div className="no-recipe">No recipes found.</div>;
  }

  return (
    <div className="recipe-grid">
      {recipes.map((item, index) => (
        <div key={index} className="recipe-card">
          <div className="card-actions">
            {location.pathname === "/myRecipes" && (
              <button
                className="icon-btn edit-icon"
                onClick={() => onEdit && onEdit(item)}
                title="Edit Recipe"
              >
                <MdEdit />
              </button>
            )}

            {(location.pathname === "/myRecipes" || isFavPage) && (
              <button
                className="icon-btn delete-icon"
                onClick={() => handleDelete(item._id)}
                title="Delete Recipe"
              >
                <MdDelete />
              </button>
            )}
          </div>

          <img
            className="recipe-img"
            src={
              item.coverImage
                ? `http://localhost:5000/uploads/${item.coverImage}`
                : fooding
            }
            alt="food"
          />

          <div className="recipe-content">
            <h3>{item.title || "Untitled Recipe"}</h3>

            {item.ingredients && (
              <p>
                <strong>Ingredients:</strong>{" "}
                {Array.isArray(item.ingredients)
                  ? item.ingredients.join(", ")
                  : item.ingredients}
              </p>
            )}

            {item.instructions && (
              <p>
                <strong>Instructions:</strong> {item.instructions}
              </p>
            )}

            {item.time && (
              <p>
                <BiStopwatch /> {item.time}
              </p>
            )}

            {!isFavPage && location.pathname === "/" && (
              <p>
                <IoIosHeart
                  onClick={() => favRecipe(item)}
                  style={{
                    color: favItems.some((res) => res._id === item._id)
                      ? "red"
                      : "gray",
                    cursor: "pointer",
                  }}
                />
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
