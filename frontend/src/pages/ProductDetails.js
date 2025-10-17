import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const demoProducts = [
  {
    _id: '1',
    name: 'Diamond Necklace',
    price: 299,
    category: 'Necklace',
    description: 'Sparkling diamond piece for elegance.',
    image: 'https://pixnio.com/free-images/2017/07/10/2017-07-10-17-21-53.jpg',
  },
  {
    _id: '2',
    name: 'Gold Ring',
    price: 199,
    category: 'Ring',
    description: 'Elegant gold ring to shine on any occasion.',
    image: 'https://img.freepik.com/premium-photo/luxury-expensive-silver-wedding-ring-jewelry-with-diamonds_63106-6868.jpg',
  },
  // Add more demo products as needed
];

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try backend first
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback to demo product
        const demo = demoProducts.find(p => p._id === id) || demoProducts[0];
        setProduct(demo);
        setError('Showing demo product because backend fetch failed.');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      {error && (
        <div className="text-center mb-4 text-red-500">{error}</div>
      )}
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl shadow-md"
            onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-serif font-bold text-gold mb-4">{product.name}</h1>
          <p className="text-gray-700 text-lg mb-4">{product.description}</p>
          <span className="text-3xl font-bold text-gold mb-6">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-gold text-black py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition mb-4"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Message Us to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
