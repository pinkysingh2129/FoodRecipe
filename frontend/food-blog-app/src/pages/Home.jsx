import React, { useEffect, useState } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import food2 from "../assets/food2.jpg";
import RecipeItem from "../components/RecipeItem";
import InputForm from "../components/InputForm";
import Modal from "../components/Modal";

export default function Home({ isFavPage }) {
  const loaderRecipes = useLoaderData();
  const [recipes, setRecipes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));

  const loadFavourites = () => {
    const user = getCurrentUser();
    const favKey = user ? `fav_${user._id || user.email}` : "fav_guest";
    const favs = JSON.parse(localStorage.getItem(favKey)) || [];
    setRecipes(favs);
  };

  useEffect(() => {
    if (isFavPage) {
      loadFavourites();
    } else {
      setRecipes(loaderRecipes);
    }

    const handleUserChange = () => {
      if (isFavPage) {
        loadFavourites();
      }
    };

    window.addEventListener("userChange", handleUserChange);
    return () => {
      window.removeEventListener("userChange", handleUserChange);
    };
  }, [isFavPage, loaderRecipes, location.pathname]);

  const addRecipe = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/addRecipe");
    } else {
      setIsOpen(true);
    }
  };

  const handleDelete = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe._id !== id);
    setRecipes(updatedRecipes);

    if (isFavPage) {
      const user = getCurrentUser();
      const favKey = user ? `fav_${user._id || user.email}` : "fav_guest";
      localStorage.setItem(favKey, JSON.stringify(updatedRecipes));
    }
  };

  return (
    <>
      {/* Hero Section */}
      {!isFavPage && (
        <section className="relative flex flex-col md:flex-row items-start px-6 md:px-16 py-14 md:py-28 bg-green-50">
          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-black">Food Recipe</h1>
            <p className="text-base md:text-lg font-semibold text-black leading-relaxed">
              FOOD RECIPE is your ultimate recipe companion! 🍽️✨ Discover and share
              delicious recipes with step-by-step instructions, ingredient lists, and
              cooking tips. Sign up or log in to add your own recipes, save favorites,
              and explore a variety of cuisines. Start your cooking journey today! 👨‍🍳🔥
            </p>
            <button
              onClick={addRecipe}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md font-medium transition duration-300"
            >
              Share your recipe
            </button>
          </div>

          {/* Image Absolutely Positioned to Right */}
          <div className="hidden md:block md:py-16 absolute right-16 top-10">
            <img
              src={food2}
              alt="Food"
              className="w-72 h-72 object-cover rounded-full shadow-lg"
            />
          </div>

          {/* Image for Mobile View (stacked) */}
          <div className="md:hidden mt-10 flex justify-center w-full">
            <img
              src={food2}
              alt="Food"
              className="w-64 h-64 object-cover rounded-full shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Modal for Login */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Modal>
      )}

      {/* Recipe Items Section */}
      <div className="px-4 sm:px-6 md:pt-20 md:px-10 lg:px-16 py-6 bg-green-50">
        <RecipeItem
          recipes={recipes}
          setRecipes={setRecipes}
          isFavPage={isFavPage}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
