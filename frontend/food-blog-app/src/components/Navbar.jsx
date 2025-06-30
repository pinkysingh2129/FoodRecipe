import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import InputForm from "./InputForm";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsLogin(!!token && token !== "null" && token !== "undefined");
        };

        checkAuth();

        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const checkLogin = () => {
        if (isLogin) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLogin(false);
            window.dispatchEvent(new Event("storage"));
        } else {
            console.log("Opening modal for login...");
            setIsOpen(true);
        }
    };

    return (
        <>
            <header>
                <h2>Food Blog</h2>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li onClick={() => !isLogin && setIsOpen(true)}>
                        <NavLink to={isLogin ? "/myRecipes" : "/"}>My Recipe</NavLink>
                    </li>
                    <li onClick={() => !isLogin && setIsOpen(true)}>
                        <NavLink to={isLogin ? "/favRecipes" : "/"}>Favourite</NavLink>
                    </li>
                    <li onClick={checkLogin} style={{ cursor: "pointer" }}>
                        <p className="login">{isLogin ? "Logout" : "Login"}</p>
                    </li>
                </ul>
            </header>
            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={setIsOpen} />
                </Modal>
            )}
        </>
    );
}
