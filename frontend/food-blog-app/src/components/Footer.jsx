import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-green-500 text-white text-center py-4 mt-10 shadow-inner">
            <p className="text-sm font-medium">
                © {new Date().getFullYear()} Imaginary Engineering. All rights reserved.
            </p>
        </footer>
    );
}