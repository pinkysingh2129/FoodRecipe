import React, { useState } from "react";
import axios from "axios";

export default function InputForm({ setIsOpen }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignUp ? "signUp" : "login";

        try {
            const res = await axios.post(
                `https://foodrecipe-4xzl.onrender.com/${endpoint}`,
                { email, password }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            window.dispatchEvent(new Event("storage"));
            setIsOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <form 
            onSubmit={handleOnSubmit} 
            className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto"
        >
            <h2 className="text-2xl font-semibold text-center text-green-600">
                {isSignUp ? "Sign Up" : "Login"}
            </h2>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
                {isSignUp ? "Sign Up" : "Login"}
            </button>

            <p
                onClick={() => setIsSignUp((prev) => !prev)}
                className="text-sm text-center text-blue-600 hover:underline cursor-pointer"
            >
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </p>
        </form>
    );
}