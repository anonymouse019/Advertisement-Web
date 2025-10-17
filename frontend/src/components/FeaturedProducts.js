import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaEnvelope } from 'react-icons/fa'; // Icons

const FeaturedProducts = ({ products }) => {
  const navigate = useNavigate();

  // Redirect to Contact.js
  const handleContactRedirect = () => navigate('/contact');

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading featured products...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-105 group"
        >
          {/* --- Product Image --- */}
          <div className="relative h-64 bg-gray-100 overflow-hidden">
            <img
              src={
                product.image ||
                `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Wishlist Icon */}
            <button
              type="button"
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaHeart className="text-red-500" size={16} />
            </button>
          </div>

          {/* --- Product Info --- */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gold">
                ${product.price}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>

            {/* --- Message to Order Button --- */}
            <button
              onClick={handleContactRedirect}
              className="w-full bg-gold text-black py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center"
            >
              <FaEnvelope className="mr-2" size={16} />
              Message to Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
