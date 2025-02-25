import React from "react";
import { useLoaderData } from "react-router-dom";
import food2 from "../assets/food2.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecipeItem from "../../components/RecipeItem";

export default function Home() {
  const allRecipes = useLoaderData(); // ✅ Fetch data at the Home level
    console.log("Fetched Recipes:", allRecipes);
    if (!Array.isArray(allRecipes)) {
    console.error("Error: `allRecipes` is not an array", allRecipes);
}

return (
    <>
    <Navbar />
    <section className="home">
        <div className="left">
        <h1>Food Recipe</h1>
        <h5>
            FOOD RECIPE is your ultimate recipe companion! 🍽️✨ Discover and share
            delicious recipes with step-by-step instructions, ingredient lists, and
            cooking tips. Sign up or log in to add your own recipes, save favorites, 
            and explore a variety of cuisines. Start your cooking journey today! 👨‍🍳🔥
        </h5>
        <button>Share your recipe</button>
        </div>
        <div className="right">
        <img src={food2} width="320px" height="300px" alt="Food" />
        </div>
    </section>
    <div className="bg">
        <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
        >
    <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,64L30,85.3C60,107,120,149,180,138.7C240,128,300,64,360,53.3C420,43,480,85,540,85.3C600,85,660,43,720,48C780,53,840,107,900,117.3C960,128,1020,96,1080,96C1140,96,1200,128,1260,128C1320,128,1380,96,1410,80L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
        </svg>
    </div>

      {/* ✅ Pass recipes as props */}
    <div className="recipe">
        <RecipeItem recipes={allRecipes} />
    </div>

    <Footer />
    </>
);
}
