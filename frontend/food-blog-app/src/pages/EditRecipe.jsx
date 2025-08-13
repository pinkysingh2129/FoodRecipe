import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`https://foodrecipe-4xzl.onrender.com/recipe/${id}`);
                const res = response.data;
                setRecipeData({
                    title: res.title,
                    ingredients: res.ingredients.join(", "),
                    instructions: res.instructions,
                    time: res.time
                });
            } catch (err) {
                console.error("Error fetching recipe", err);
            }
        };
        getData();
    }, [id]);

    const onHandleChange = (e) => {
        let val;
        if (e.target.name === "ingredients") {
            val = e.target.value;
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
        formData.append("ingredients", JSON.stringify(recipeData.ingredients.split(",").map(i => i.trim())));
        formData.append("instructions", recipeData.instructions);
        if (recipeData.file) formData.append("file", recipeData.file);

        try {
            await axios.put(`https://foodrecipe-4xzl.onrender.com/recipe/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": "bearer " + localStorage.getItem("token")
                }
            });

            navigate("/myRecipes");
        } catch (err) {
            console.error("❌ Error updating recipe:", err.response?.data || err.message);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Edit Recipe</h2>
                <form onSubmit={onHandleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-green-700 font-semibold mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            onChange={onHandleChange}
                            value={recipeData.title || ''}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-semibold mb-1">Time</label>
                        <input
                            type="text"
                            name="time"
                            onChange={onHandleChange}
                            value={recipeData.time || ''}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                   <div>
    <label className="block text-green-700 font-semibold mb-1">Ingredients</label>
    <textarea
        name="ingredients"
        rows={4}
        onChange={(e) =>
            setRecipeData((prev) => ({
                ...prev,
                ingredients: e.target.value
                    .split(',')
                    .map((item) => item.trim()) // remove spaces
                    .filter((item) => item !== '') // remove empty entries
            }))
        }
        value={recipeData.ingredients ? recipeData.ingredients.join(', ') : ''}
        className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    />
</div>

                    <div>
                        <label className="block text-green-700 font-semibold mb-1">Instructions</label>
                        <textarea
                            name="instructions"
                            rows="4"
                            onChange={onHandleChange}
                            value={recipeData.instructions || ''}
                            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-green-700 font-semibold mb-1">Recipe Image</label>
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
                        Update Recipe
                    </button>
                </form>
            </div>
        </div>
    );
}