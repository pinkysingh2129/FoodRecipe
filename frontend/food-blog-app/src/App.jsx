import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home"; // Ensure correct path
import MainNavigation from "../components/MainNavigation"; // Ensure correct path
import axios from "axios";

const getAllRecipes = async () => {
  try {
    const res = await axios.get("http://localhost:5000/recipe");
    console.log(res.data);
    return res.data; // Return fetched data
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return empty array in case of error
  }
};

// Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        index: true, // ✅ Default child route
        element: <Home />,
        loader: getAllRecipes,
      },
    ],
  },
]);

// Main App Component
export default function App() {
  return <RouterProvider router={router} />;
}

