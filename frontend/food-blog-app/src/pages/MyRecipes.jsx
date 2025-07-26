import React, { useEffect, useState } from "react";

const MyRecipes = () => {
const [recipes, setRecipes] = useState([]);

useEffect(() => {
    const fetchMyRecipes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("User not logged in");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/recipe/my", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        if (!res.ok) {
        throw new Error("Failed to fetch user recipes");
        }

        const data = await res.json();
        console.log(data)
        setRecipes(data);
    } catch (err) {
        console.error(err.message);
    }
    };

    fetchMyRecipes();
}, []);

return (
    <div>
    <h2>My Recipes</h2>
    {recipes.length === 0 ? (
        <p>No recipes found.</p>
    ) : (
        <ul>
        {recipes.map((recipe) => (
            <li key={recipe._id}>
            <h3>{recipe.title}</h3>
            <img
                src={`http://localhost:5000/uploads/${recipe.coverImage}`}
                alt={recipe.title}
                width="200"
            />
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            <p><strong>Time:</strong> {recipe.time}</p>
            </li>
        ))}
        </ul>
    )}
    </div>
);
};

export default MyRecipes;
