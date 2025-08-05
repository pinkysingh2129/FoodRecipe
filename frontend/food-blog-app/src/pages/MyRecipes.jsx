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
        const res = await axios.get("http://localhost:5000/recipe/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/recipe/${id}`, {
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
    <div className="my-recipes-container">
      <h2>My Recipes</h2>
      {recipes.length === 0 ? (
        <p className="no-recipe">You haven’t added any recipes yet!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div className="recipe-card" key={recipe._id}>
              <div className="card-actions">
                <button
                  className="icon-btn edit-btn"
                  onClick={() => handleEdit(recipe._id)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDelete(recipe._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
              <img
                src={`http://localhost:5000/uploads/${recipe.coverImage}`}
                alt={recipe.title}
                className="recipe-img"
              />
              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
                <p><strong>Time:</strong> {recipe.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
