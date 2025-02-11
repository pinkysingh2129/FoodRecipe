import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home' // Ensure correct path
import MainNavigation from '../components/MainNavigation';
import axios from 'axios'


const getAllRecipes = async()=>{
  let allRecipes=[]
  await  axios.get('http://localhost:5000/recipe').then(res=>{
    allRecipes=res.data
  })
  return allrecipes
}

const router = createBrowserRouter([
  {path: '/',element: <MainNavigation/>,children:[
    {path: '/',element: <Home />,loader:getAllRecipes}
  ]},
]);

export default function App() {
  return <RouterProvider router={router} />;
}
