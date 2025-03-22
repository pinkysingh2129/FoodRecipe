import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: "",
        time: "",
        ingredients: [],
        instructions: "",
        file: null
    });

    const navigate = useNavigate();

    const onHandleChange = (e) => {
        let val = e.target.value;

        if (e.target.name === "ingredients") {
            val = e.target.value.split(",").map(item => item.trim()).filter(Boolean); // ✅ Fix: Split by commas
        } else if (e.target.name === "file") {
            val = e.target.files?.[0] || null;  
        }

        setRecipeData((prev) => ({
            ...prev,
            [e.target.name]: val
        }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        console.log("🚀 Recipe Data Before Submission:", recipeData);

        if (!recipeData.title || !recipeData.time || !recipeData.ingredients.length || !recipeData.instructions || !recipeData.file) {
            alert("All fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("ingredients", JSON.stringify(recipeData.ingredients));  // ✅ Fix: Send as JSON string
        formData.append("instructions", recipeData.instructions);
        formData.append("coverImage", recipeData.file);

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const response = await axios.post("http://localhost:5000/recipe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": "bearer " + localStorage.getItem("token"),
                },
            });

            console.log("✅ Server Response:", response.data);

            alert("Recipe submitted successfully!");
            setRecipeData({ title: "", time: "", ingredients: [], instructions: "", file: null });
            navigate("/");
        } catch (error) {
            console.error("❌ Error submitting recipe:", error.response?.data || error.message);
            alert("Failed to submit recipe. Please try again.");
        }
    };

    return (
        <>
            <div className="container">
                <form className="form" onSubmit={onHandleSubmit}>
                    <div className="form-control">
                        <label>Title</label>
                        <input type="text" className="input" name="title" value={recipeData.title} onChange={onHandleChange} />
                    </div>
                    <div className="form-control">
                        <label>Time</label>
                        <input type="text" className="input" name="time" value={recipeData.time} onChange={onHandleChange} />
                    </div>
                    <div className="form-control">
                        <label>Ingredients (Comma-separated)</label>
                        <textarea className="input-textarea" name="ingredients" rows="5" value={recipeData.ingredients.join(", ")} onChange={onHandleChange}></textarea>
                    </div>
                    <div className="form-control">
                        <label>Instructions</label>
                        <textarea className="input-textarea" name="instructions" rows="5" value={recipeData.instructions} onChange={onHandleChange}></textarea>
                    </div>
                    <div className="form-control">
                        <label>Recipe Image</label>
                        <input type="file" className="input" name="file" accept="image/*" onChange={onHandleChange} />
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    );
}
