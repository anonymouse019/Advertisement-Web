import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch featured products
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products/featured')
      .then((res) => setFeaturedProducts(res.data))
      .catch((err) => {
        console.error('Error fetching products:', err);
        // Fallback static data if API fails
        setFeaturedProducts([
          {
            _id: '1',
            name: 'Diamond Necklace',
            price: 299,
            image:
              'https://www.tanishq.co.in/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw57c3e329/images/hi-res/50O3UN2AYABA09_1.jpg',
            category: 'Necklace',
            description: 'Sparkling diamond piece for elegance.',
          },
        ]);
      });
  }, []);

  // Redirect to Contact.js
  const handleContactRedirect = () => {
    navigate('/contact');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero onContactClick={handleContactRedirect} />

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Featured Collection
          </h2>
          <FeaturedProducts
            products={featuredProducts}
            onContactClick={handleContactRedirect}
          />
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-4 font-semibold">Join Our Community</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your sparkle stories and connect with jewelry lovers.
          </p>
          <button
            onClick={handleContactRedirect}
            className="mt-6 inline-block bg-gold text-black px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-4 font-semibold">Newsletter Signup</h2>
          <p className="mb-8">Get exclusive offers and new arrivals.</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gold text-black px-8 py-3 rounded-r-full font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
