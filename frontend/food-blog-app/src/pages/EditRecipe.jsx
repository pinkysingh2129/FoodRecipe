import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
const [recipeData, setRecipeData] = useState({});
const navigate = useNavigate();
const { id } = useParams();

useEffect(() => {
    const getData = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/recipe/${id}`);
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
    if (recipeData.file) formData.append("file", recipeData.file); // Only append if changed

    try {
    await axios.put(`http://localhost:5000/recipe/${id}`, recipeData, {
        headers: {
        "Content-Type": "multipart/form-data",
        "authorization": "bearer " + localStorage.getItem("token")
        }
    })
    .then(()=> navigate("/myRecipes"))

    navigate("/myRecipes");
    } catch (err) {
    console.error("❌ Error updating recipe:", err.response?.data || err.message);
    }
};

return (
    <div className='container'>
    <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
        <label>Title</label>
        <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title || ''} />
        </div>
        <div className='form-control'>
        <label>Time</label>
        <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time || ''} />
        </div>
        <div className='form-control'>
        <label>Ingredients</label>
        <textarea className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients || ''}></textarea>
        </div>
        <div className='form-control'>
        <label>Instructions</label>
        <textarea className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions || ''}></textarea>
        </div>
        <div className='form-control'>
        <label>Recipe Image</label>
        <input type="file" className='input' name="file" onChange={onHandleChange} />
        </div>
        <button type="submit">Update Recipe</button>
    </form>
    </div>
);
}
