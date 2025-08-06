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
    return <div className="text-center text-gray-500 text-lg mt-10">No recipes found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {recipes.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md overflow-hidden relative hover:shadow-xl transition-shadow duration-300"
        >
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            {location.pathname === "/myRecipes" && (
              <button
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                onClick={() => onEdit && onEdit(item)}
                title="Edit Recipe"
              >
                <MdEdit size={20} />
              </button>
            )}

            {(location.pathname === "/myRecipes" || isFavPage) && (
              <button
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                onClick={() => handleDelete(item._id)}
                title="Delete Recipe"
              >
                <MdDelete size={20} />
              </button>
            )}
          </div>

          <img
            className="w-full h-48 object-cover"
            src={
              item.coverImage && item.coverImage.trim() !== ""
                ? `https://foodrecipe-4xzl.onrender.com/uploads/${item.coverImage}`
                : fooding
            }
            alt="food"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fooding;
            }}
          />

          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-green-600">{item.title || "Untitled Recipe"}</h3>

            {item.ingredients && (
              <p className="text-gray-700 mb-2 text-sm">
                <strong>Ingredients:</strong>{" "}
                {Array.isArray(item.ingredients)
                  ? item.ingredients.join(", ")
                  : item.ingredients}
              </p>
            )}

            {item.instructions && (
              <p className="text-gray-700 mb-2 text-sm">
                <strong>Instructions:</strong> {item.instructions}
              </p>
            )}

            {item.time && (
              <p className="text-gray-500 flex items-center gap-1 text-sm">
                <BiStopwatch /> {item.time}
              </p>
            )}

            {!isFavPage && location.pathname === "/" && (
              <div className="mt-2 flex justify-end">
                <IoIosHeart
                  size={24}
                  onClick={() => favRecipe(item)}
                  className={`cursor-pointer ${
                    favItems.some((res) => res._id === item._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  } hover:scale-110 transition-transform`}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
