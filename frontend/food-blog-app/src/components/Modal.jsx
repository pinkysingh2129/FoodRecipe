import React from 'react';

export default function Modal({ children, onClose }) {
    return (
        <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
                    aria-label="Close Modal"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}