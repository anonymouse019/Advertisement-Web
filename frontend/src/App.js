import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@emailjs/browser';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';  // New import
import Verify from './pages/Verify';
import Footer from './components/Footer';
import Shop from './pages/Shop'; 
// Protected Route Component (requires login)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Profile Stub (protected example)
const Profile = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl elegant mb-4">Your Profile</h1>
    <p className="text-gray-600">Welcome back! View your orders, wishlist, and settings.</p>
    {/* TODO: Fetch user data, orders */}
  </div>
);

// Cart Stub (protected)
const Cart = () => (
  <ProtectedRoute>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl elegant mb-4">Your Cart</h1>
      <p className="text-gray-600">Your selected jewelry items.</p>
      {/* TODO: Display cart items, total, checkout */}
    </div>
  </ProtectedRoute>
);

const App = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser ] = useState(null);  // Global user state

  useEffect(() => {
    // Load cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Load user/token (verify token validity later)
    const token = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');
    if (token && savedUser ) {
      setUser (JSON.parse(savedUser ));
      // Optional: Set axios default header for auth
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser (null);
    delete axios.defaults.headers.common['x-auth-token'];
    // Redirect to home
  };

  return (
    <Router>
      <div className="App">
        <Header cart={cart} user={user} setUser ={setUser } logout={logout} />  {/* Pass logout */}
        <main>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />  {/* New route */}
            <Route path="/verify/:id" element={<Verify />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            {/* Other stubs */}
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/community" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl elegant">Community (Coming Soon)</h1></div>} />
            <Route path="/about" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl elegant">About (Coming Soon)</h1></div>} />
            <Route path="/contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl elegant">Contact (Coming Soon)</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;