import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import InputForm from "./InputForm";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("user"));
            setIsLogin(!!token && token !== "null" && token !== "undefined");
            setUser(currentUser);
        };

        checkAuth();

        window.addEventListener("storage", checkAuth);
        window.addEventListener("userChange", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("userChange", checkAuth);
        };
    }, []);

    const checkLogin = () => {
        if (isLogin) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLogin(false);
            window.dispatchEvent(new Event("storage"));
            window.dispatchEvent(new Event("userChange"));  // <-- Custom Event to refresh favs
            // Optional: Force page reload if needed
            // window.location.reload();
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
                        <p className="login">
                            {isLogin ? "Logout" : "Login"}
                            {user?.email ? ` (${user?.email})` : ""}
                        </p>
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
