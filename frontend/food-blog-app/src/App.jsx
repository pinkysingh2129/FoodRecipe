import React, { Suspense } from "react";
// import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import MyRecipes from "./pages/MyRecipes";
import EditRecipe from "./pages/EditRecipe";

// Loader for all recipes (Home page)
const getAllRecipes = async () => {
  try {
    const res = await axios.get("https://foodrecipe-4xzl.onrender.com/recipe", { cache: "no-cache" });
    return res.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

// Loader for My Recipes
const getMyRecipe = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user._id || !token) {
    console.warn("User not logged in or token missing.");
    return [];
  }

  try {
    const res = await axios.get("https://foodrecipe-4xzl.onrender.com/recipe/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.filter(recipe => recipe.createdBy === user._id);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};


// Loader for Favourites
const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav")) || [];
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        index: true,
        element: <Home isFavPage={false} />, // ✅ Explicitly mark as NOT fav page
        loader: getAllRecipes,
      },
      {
        path: "/myRecipes",
        element: <MyRecipes />,
        loader: getMyRecipe,
      },
      {
        path: "/favRecipes",
        element: <Home isFavPage={true} />, // ✅ This tells Home to treat as fav page
        loader: getFavRecipes,
      },
      {
        path: "/addRecipe",
        element: <AddFoodRecipe />,
      },
      {
        path: "/editRecipe/:id",
        element: <EditRecipe />,
      },
      {
        path: "*",
        element: <h1 style={{ padding: "1rem" }}>404 | Page Not Found</h1>,
      },
    ],
  },
]);

export default function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
