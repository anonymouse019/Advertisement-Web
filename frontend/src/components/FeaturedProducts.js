import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // Cart and wishlist icons

const FeaturedProducts = ({ products, addToCart }) => {
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
          className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 group"
        >
          {/* Product Image */}
          <div className="relative h-64 bg-gray-100 overflow-hidden">
            <img
              src={product.image || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(product.name)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Wishlist Icon Overlay */}
            <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <FaHeart className="text-red-500" size={16} />
            </button>
          </div>

          {/* Product Details */}
          <div className="p-6">
            <h3 className="text-xl font-semibold elegant mb-2 text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gold">${product.price}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-gold text-black py-3 px-4 rounded-full font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" size={16} />
                Add to Cart
              </button>
              <Link
                to={`/shop/${product._id}`} // Detail page stub; implement later
                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <FaHeart className="text-gray-600" size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;