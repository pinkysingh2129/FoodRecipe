import React, { useState } from 'react'
import Modal from "./Modal";  // Ensure the path is correct
import InputForm from "./InputForm"; // Ensure the correct path

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    const checkLogin =()=>{
        setIsOpen(true)
    }
    return (
        <>
            <header>
                <h2>Food blog </h2>
                <ul>
                    <li>Home</li>
                    <li>My Recipe </li>
                    <li>Favourites</li>
                    <li onClick={checkLogin} style={{ cursor: "pointer" }}>Login</li>
                </ul>
            </header>
            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                <InputForm setIsOpen={setIsOpen} />
                </Modal> 
                )}
        </>
    )
}
