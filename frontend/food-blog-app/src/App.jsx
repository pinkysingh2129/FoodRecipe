import React, { Suspense } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home"; 
import MainNavigation from "./components/MainNavigation"; 
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import MyRecipes from "./pages/MyRecipes";

// Inside your <Routes>:


const getAllRecipes = async () => {
  try {
    const res = await axios.get("http://localhost:5000/recipe", { cache: "no-cache" }); // 🔄 Ensure fresh data
    console.log("Fetched Recipes:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

const getMyRecipe = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user._id) return [];

  try {
    const res = await axios.get("http://localhost:5000/recipe/my");
    const allRecipes = res.data;

    return allRecipes.filter(recipe => recipe.createdBy === user._id);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

// Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: getAllRecipes,
      },
  // {
  //   path: "/myRecipes",
  //   element: <Home/>,
  //   loader:getMyRecipe 
  // },
  {
    path: "/favRecipe",
    element: <Home />,
  },
  {
    path: "/addRecipe",
    element: <AddFoodRecipe />,
  },
  
{ 
  path : "/myRecipes", 
  element : <MyRecipes /> ,
}
],
},
]);

// ✅ Keep only ONE App function
export default function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
