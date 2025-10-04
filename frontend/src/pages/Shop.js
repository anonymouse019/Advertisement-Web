import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';  // For search/filter icons

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');  // Filter state
  const [sortBy, setSortBy] = useState('Newest');  // Optional sort

  // Categories from backend (hardcoded for dropdown; fetch dynamically if needed)
  const categories = ['All', 'Necklace', 'Ring', 'Earrings', 'Bracelet', 'Pendant'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setFilteredProducts(res.data);  // Initial: All products
        setError('');
      } catch (err) {
        console.error('Shop fetch error:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter and search logic (client-side)
    let results = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Search filter (name or description)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort (optional: by price asc/desc or date)
    if (sortBy === 'Price Low to High') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price High to Low') {
      results.sort((a, b) => b.price - a.price);
    } else {
      // Newest (default: by createdAt desc)
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show toast (add react-hot-toast later)
    console.log('Added to cart:', product.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jewelry collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold elegant text-gray-900 mb-4">
            Discover Our Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore exquisite jewelry pieces crafted with passion and precision. Find your perfect sparkle.
          </p>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 max-w-xs">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort (Optional) */}
          <div className="flex-1 max-w-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="Newest">Newest</option>
              <option value="Price Low to High">Price: Low to High</option>
              <option value="Price High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark">
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}  // Fallback
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>  {/* Truncate desc */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gold">${product.price.toFixed(2)}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gold text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-dark transition duration-200 flex items-center justify-center"
                  >
                    Add to Cart
                  </button>
                  {product.stock === 0 && <p className="text-red-500 text-xs mt-2 text-center">Out of Stock</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-500">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </div>
    </div>
  );
};

export default Shop;