import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import InputForm from "./InputForm";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
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
            window.dispatchEvent(new Event("userChange"));
        } else {
            setIsOpen(true);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [menuOpen]);

    return (
        <>
            <header className="flex justify-between items-center px-6 py-4 bg-green-100 text-black relative z-50 shadow-md md:rounded-b-xl">
                <h2 className="text-2xl font-semibold">Food Blog</h2>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex ml-auto gap-6 items-center">
                    <NavLink to="/" className="hover:underline text-lg">Home</NavLink>
                    <NavLink to={isLogin ? "/myRecipes" : "/"} onClick={() => !isLogin && setIsOpen(true)} className="hover:underline text-lg">My Recipe</NavLink>
                    <NavLink to={isLogin ? "/favRecipes" : "/"} onClick={() => !isLogin && setIsOpen(true)} className="hover:underline text-lg">Favourite</NavLink>
                    <p onClick={checkLogin} className="hover:underline text-lg cursor-pointer">
                        {isLogin ? "Logout" : "Login"}
                        {user?.email ? ` (${user?.email})` : ""}
                    </p>
                </div>

                {/* Hamburger Icon (Mobile Only) */}
                <div
                    className={`flex flex-col justify-center items-center w-8 h-6 cursor-pointer md:hidden ${menuOpen ? "space-y-0" : "space-y-1.5"}`}
                    onClick={toggleMenu}
                >
                    <span className={`block h-1 w-full bg-black transition-transform duration-300 ${menuOpen ? "transform rotate-45 translate-y-2" : ""}`}></span>
                    <span className={`block h-1 w-full bg-black transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}></span>
                    <span className={`block h-1 w-full bg-black transition-transform duration-300 ${menuOpen ? "transform -rotate-45 -translate-y-2" : ""}`}></span>
                </div>

                {/* Mobile Slide Menu */}
                <ul className={`
                    fixed top-0 right-0 h-full w-2/3 bg-white text-green-500 flex flex-col items-center justify-center gap-12 transform transition-transform duration-300 ease-in-out
                    ${menuOpen ? "translate-x-0" : "translate-x-full"}
                    md:hidden
                `}>
                    <li>
                        <NavLink to="/" onClick={() => setMenuOpen(false)} className="hover:underline text-lg">Home</NavLink>
                    </li>
                    <li onClick={() => !isLogin && setIsOpen(true)}>
                        <NavLink to={isLogin ? "/myRecipes" : "/"} onClick={() => setMenuOpen(false)} className="hover:underline text-lg">My Recipe</NavLink>
                    </li>
                    <li onClick={() => !isLogin && setIsOpen(true)}>
                        <NavLink to={isLogin ? "/favRecipes" : "/"} onClick={() => setMenuOpen(false)} className="hover:underline text-lg">Favourite</NavLink>
                    </li>
                    <li onClick={() => { checkLogin(); setMenuOpen(false); }} className="cursor-pointer">
                        <p className="hover:underline text-lg">
                            {isLogin ? "Logout" : "Login"}
                            {user?.email ? ` (${user?.email})` : ""}
                        </p>
                    </li>
                </ul>
            </header>

            {/* Overlay when Mobile Menu is open */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            {/* Modal for Login */}
            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={setIsOpen} />
                </Modal>
            )}
        </>
    );
}
