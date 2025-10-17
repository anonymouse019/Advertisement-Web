import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const Header = () => {
  const { user, cart, logout, loading } = useAuth();

  // Total quantity of items in cart
  const totalQuantity = cart ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

  if (loading) {
    return (
      <header className="bg-[#0b1733] shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#0b1733] shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold text-[#d4af37]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Shine & Sparkle
        </Link>

        <nav className="hidden md:flex space-x-8 text-white uppercase text-sm font-semibold tracking-wide">
          <Link to="/" className="hover:text-[#d4af37] transition">Home</Link>
          <Link to="/shop" className="hover:text-[#d4af37] transition">Shop</Link>
          <Link to="/collections" className="hover:text-[#d4af37] transition">Collections</Link>
          <Link to="/about" className="hover:text-[#d4af37] transition">About</Link>
          <Link to="/contact" className="hover:text-[#d4af37] transition">Contact</Link>
          {/* <Link to="/cart" className="hover:text-[#d4af37] transition">
            Cart ({totalQuantity})
          </Link> */}
        </nav>

        <div className="flex items-center space-x-4">
          {/* <Link to="/cart" className="relative">
            <FaShoppingCart size={22} className="text-[#d4af37]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1 text-xs flex items-center justify-center min-w-[1rem] h-[1rem]">
                {totalQuantity}
              </span>
            )}
          </Link> */}

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-[#d4af37] font-semibold">
                Hi, {user.name || user.fullname || user.email || 'User'}
              </span>
              <button
                onClick={logout}
                className="bg-[#d4af37] text-[#0b1733] px-4 py-2 rounded font-semibold hover:bg-[#c29e30] transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/register"
                className="bg-transparent border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded font-semibold hover:bg-[#d4af37] hover:text-[#0b1733] transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-[#d4af37] text-[#0b1733] px-4 py-2 rounded font-semibold hover:bg-[#c29e30] transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
