import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser  } from 'react-icons/fa';  // Fixed spacing

const Header = ({ user, cart, logout }) => {
  // Total cart quantity (your logic—correct!)
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-gold elegant">
          Shine & Sparkle
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-gold transition">Home</Link>
          <Link to="/shop" className="text-gray-700 hover:text-gold transition">Shop</Link>
          <Link to="/community" className="text-gray-700 hover:text-gold transition">Community</Link>
          <Link to="/about" className="text-gray-700 hover:text-gold transition">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-gold transition">Contact</Link>
        </nav>

        {/* Right Side: Cart + Auth */}
        <div className="flex items-center space-x-4 flex-wrap">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <FaShoppingCart size={24} className="text-gold" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs min-w-[20px] flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* User Auth: Single Conditional (Logged In vs Guest) */}
          {user ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/profile" title="Profile">
                <FaUser  size={20} className="text-gold hover:text-gold-dark" />
              </Link>
              <span className="hidden sm:inline text-sm text-gray-700">Hi, {user.name}!</span>
              <button
                onClick={logout}
                className="bg-gold text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm font-medium hover:bg-gold-dark transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2 md:space-x-4">
              <Link
                to="/login"
                className="bg-gold text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm font-medium hover:bg-gold-dark transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-gold text-gold px-3 py-1 md:px-4 md:py-2 rounded text-sm font-medium hover:bg-gold hover:text-white transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;