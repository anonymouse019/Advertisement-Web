import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const navigate = useNavigate();

  const categories = ['All', 'Necklace', 'Ring', 'Earrings', 'Bracelet', 'Pendant'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setFilteredProducts(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let results = [...products];
    if (selectedCategory !== 'All') results = results.filter(p => p.category === selectedCategory);
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
    }
    if (sortBy === 'Price Low to High') results.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price High to Low') results.sort((a, b) => b.price - a.price);
    else results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const handleContactOrder = (product) => {
    navigate('/contact', {
      state: {
        productName: product.name,
        productImage: product.image,
      },
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
        <p className="mt-4 text-gray-800">Loading our exquisite collection...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-gold mb-4">Discover Our Collection</h1>
          <p className="text-gray-700 text-xl max-w-2xl mx-auto">
            Explore luxurious jewelry crafted with passion. Find your perfect sparkle.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 p-6 rounded-xl shadow-md bg-gray-50 border border-gray-200">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white text-gray-800 border border-gray-300 shadow-sm hover:shadow-lg transition"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 max-w-xs">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white text-gray-800 border border-gray-300 shadow-sm hover:shadow-lg transition appearance-none"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1 max-w-xs">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white text-gray-800 border border-gray-300 shadow-sm hover:shadow-lg transition"
            >
              <option value="Newest">Newest</option>
              <option value="Price Low to High">Price: Low to High</option>
              <option value="Price High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gold text-black px-6 py-2 rounded-lg hover:bg-gold-dark transition"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              >
                <div className="relative h-56 bg-gray-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gold">${product.price.toFixed(2)}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>
                  </div>
                  <button
                    onClick={() => handleContactOrder(product)}
                    className="w-full bg-gold text-black py-2 px-4 rounded-lg font-semibold hover:bg-gold-dark transition flex justify-center items-center"
                  >
                    Message us to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default Shop;
