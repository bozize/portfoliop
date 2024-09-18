import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.png';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex items-center justify-between">
          <li>
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="GigConnect" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-800">GigConnect</span>
            </Link>
          </li>
          <li className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
            <Link to="/signup" className="text-gray-600 hover:text-gray-800">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
