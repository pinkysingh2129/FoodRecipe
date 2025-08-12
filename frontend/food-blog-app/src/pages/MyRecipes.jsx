import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://foodrecipe-4xzl.onrender.com/recipe/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecipes(res.data);
      } catch (error) {
        console.error("Failed to fetch user recipes", error);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editRecipe/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://foodrecipe-4xzl.onrender.com/recipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Failed to delete recipe", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-6 md:px-16 py-10">
      <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">
        My Recipes
      </h2>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven’t added any recipes yet!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white shadow-md rounded-lg overflow-hidden relative hover:shadow-xl transition duration-300"
            >
              {/* Edit/Delete Icons */}
              <div className="absolute top-2 right-2 flex space-x-2 z-10">
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => handleEdit(recipe._id)}
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(recipe._id)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              <img
                src={recipe.coverImage} // ✅ Now directly using Cloudinary URL
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Instructions:</strong> {recipe.instructions}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {recipe.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
