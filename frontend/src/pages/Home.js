import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts'; // We'll create this next

const Home = ({ addToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:5000/api/products/featured')
    .then(res => setFeaturedProducts(res.data)) // Top 6 featured
    .catch(err => {
      console.error('Error fetching products:', err);
      // Fallback static data if API fails (for demo)
      setFeaturedProducts([
        { _id: '1', name: 'Diamond Necklace', price: 299, image: 'https://images.unsplash.com/photo-1512968558200-3d7c5d5b3f0d?w=300', category: 'Necklace', description: 'Sparkling diamond piece for elegance.' },
        // Add 5 more static if needed
      ]);
    });
}, []);

  return (
    <div className="bg-white">
      {/* Hero Section - Next after Header */}
      <Hero addToCart={addToCart} />

      {/* Preview: Featured Products Section (Coming Next) */}
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold elegant text-center mb-12 text-gray-800">Featured Collection</h2>
          <FeaturedProducts products={featuredProducts} addToCart={addToCart} />
        </div>
      </section>

      {/* Additional Sections (Stub - Expand Later) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl elegant mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your sparkle stories and connect with jewelry lovers.
          </p>
          <a href="/community" className="mt-6 inline-block bg-gold text-black px-8 py-3 rounded-full font-semibold">
            Visit Community
          </a>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl elegant mb-4">Newsletter Signup</h2>
          <p className="mb-8">Get exclusive offers and new arrivals.</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-black focus:outline-none"
            />
            <button type="submit" className="bg-gold text-black px-8 py-3 rounded-r-full font-semibold">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;