import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({});
    const navigate = useNavigate();

    const onHandleChange = (e) => {
        let val;
        if (e.target.name === "ingredients") {
            val = e.target.value.split(",").map(i => i.trim());
        } else if (e.target.name === "file") {
            val = e.target.files[0];
        } else {
            val = e.target.value;
        }

        setRecipeData(prev => ({ ...prev, [e.target.name]: val }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("ingredients", JSON.stringify(recipeData.ingredients));
        formData.append("instructions", recipeData.instructions);
        formData.append("file", recipeData.file);

        try {
            await axios.post("https://foodrecipe-4xzl.onrender.com/recipe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": "bearer " + localStorage.getItem("token")
                }
            });

            navigate("/");
        } catch (err) {
            console.error("❌ Error submitting recipe:", err.response?.data || err.message);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Add New Recipe</h2>
                <form onSubmit={onHandleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-black font-semibold mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            onChange={onHandleChange}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-black font-semibold mb-1">Time</label>
                        <input
                            type="text"
                            name="time"
                            onChange={onHandleChange}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-black font-semibold mb-1">Ingredients (comma separated)</label>
                        <textarea
                            name="ingredients"
                            rows="4"
                            onChange={onHandleChange}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-black font-semibold mb-1">Instructions</label>
                        <textarea
                            name="instructions"
                            rows="4"
                            onChange={onHandleChange}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-black font-semibold mb-1">Recipe Image</label>
                        <input
                            type="file"
                            name="file"
                            onChange={onHandleChange}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Add Recipe
                    </button>
                </form>
            </div>
        </div>
    );
}