// src/components/Navbar.jsx
import React from 'react';
import reactLogo from '../assets/react.svg';

const Navbar = () => {
  return (
    <nav className="bg-gray-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title Container */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img src={reactLogo} className="w-10 h-10" alt="React logo" />
          {/* Title */}
          <h1 className="text-white text-2xl font-bold">ChatTube</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
