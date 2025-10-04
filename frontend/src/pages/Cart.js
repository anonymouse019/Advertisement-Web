import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../Context/AuthContext';

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const { user, cart, updateCart, logout } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => {  // Fallback fetch if needed
    if (!user) return;
    try {
      const res = await api.get('/cart');
      updateCart(res.data.cart, res.data.total);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  };

  useEffect(() => {
    if (user && cart.length === 0) fetchCart();  // Load if empty
  }, [user]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setLoading(true);
    try {
      const res = await api.put(`/cart/update/${productId}`, { quantity });
      updateCart(res.data.cart, res.data.total);  // Sync global
    } catch (err) {
      console.error('Update error:', err);
    }
    setLoading(false);
  };

  const removeItem = async (productId) => {
    if (window.confirm('Remove this item?')) {
      setLoading(true);
      try {
        const res = await api.delete(`/cart/remove/${productId}`);
        updateCart(res.data.cart, res.data.total);
      } catch (err) {
        console.error('Remove error:', err);
      }
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      setLoading(true);
      try {
        await api.delete('/cart');
        updateCart([], '0.00');
      } catch (err) {
        console.error('Clear error:', err);
      }
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    // TODO: Real payment (Stripe/PayPal) - For now, simulate
    alert(`Processing order for $${calculateTotal()}. Cart cleared!`);
    clearCart();  // Clear after "payment"
    navigate('/order-success');  // Or /profile/orders
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
          <p>Please <Link to="/login" className="text-gold underline">log in</Link> to view your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link to="/products" className="text-gold underline">Continue Shopping</Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/products" className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={loading}
                        className="bg-gray-200 px-3 py-1 rounded-l disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 border border-gray-300 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={loading}
                        className="bg-gray-200 px-3 py-1 rounded-r disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gray-900 min-w-[80px] text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Subtotal ({cart.length} items):</span>
                <span className="text-2xl font-bold text-gray-900">${calculateTotal()}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="flex-1 bg-gold text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;