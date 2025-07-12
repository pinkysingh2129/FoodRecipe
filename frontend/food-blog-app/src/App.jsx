import React, { Suspense } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home"; 
import MainNavigation from "./components/MainNavigation"; 
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";

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

const getMyRecipe = async ()=>{
  let user = JSON.parse(localStorage.getItem("user"))
  let allRecipes=await getAllRecipes()
  return allRecipes.filter(item=>item.createdBy===user._id)
}

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
  {
    path: "/myRecipes",
    element: <Home/>,
    loader:getMyRecipe 
  },
  {
    path: "/favRecipe",
    element: <Home />,
  },
  {
    path: "/addRecipe",
    element: <AddFoodRecipe />,
  },
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
