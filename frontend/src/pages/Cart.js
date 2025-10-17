// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../Context/AuthContext';

// const Cart = () => {
//   const { cart, updateCartItem, removeFromCart, clearCart } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // Modal state
//   const [confirmState, setConfirmState] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     action: null,
//   });

//   const calculateTotal = () => {
//     return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0).toFixed(2);
//   };

//   // --- Confirmation Modal Handlers ---
//   const openConfirm = (title, message, action) => {
//     setConfirmState({ isOpen: true, title, message, action });
//   };

//   const closeConfirm = () => {
//     setConfirmState({ isOpen: false, title: '', message: '', action: null });
//   };

//   const executeAction = () => {
//     if (confirmState.action) confirmState.action();
//     closeConfirm();
//   };

//   // --- Cart Actions with Confirmation ---
//   const handleRemoveItem = (id) => {
//     openConfirm(
//       'Remove Item?',
//       'Are you sure you want to remove this item from your cart?',
//       () => removeFromCart(id)
//     );
//   };

//   const handleClearCart = () => {
//     if (!cart || cart.length === 0) return;
//     openConfirm(
//       'Clear Cart?',
//       'Are you sure you want to remove ALL items from your cart?',
//       () => clearCart()
//     );
//   };

//   const handleCheckout = () => {
//     if (!cart || cart.length === 0) {
//       alert('Cart is empty!');
//       return;
//     }
//     openConfirm(
//       'Confirm Order',
//       `You are about to place an order for $${calculateTotal()}. Do you wish to continue?`,
//       () => {
//         setLoading(true);
//         setTimeout(() => {
//           clearCart();
//           setLoading(false);
//           navigate('/order-success');
//         }, 500);
//       }
//     );
//   };

//   // --- Confirmation Modal Component ---
//   const ConfirmationModal = () => {
//     if (!confirmState.isOpen) return null;
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
//         <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all border border-amber-500/30">
//           <h2 className="text-2xl font-serif font-bold text-amber-400 mb-4 border-b border-gray-700 pb-2">
//             {confirmState.title}
//           </h2>
//           <p className="text-gray-200 mb-6">{confirmState.message}</p>
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={closeConfirm}
//               className="bg-gray-600 text-gray-100 px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
//             >
//               {confirmState.action ? 'Cancel' : 'Close'}
//             </button>
//             {confirmState.action && (
//               <button
//                 onClick={executeAction}
//                 className="bg-amber-500 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors shadow-lg"
//               >
//                 Confirm
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20 flex flex-col items-center justify-center text-center">
//         <div className="w-24 h-24 mb-6 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
//           <span className="text-3xl text-amber-600">💎</span>
//         </div>
//         <h2 className="text-3xl md:text-4xl font-serif mb-4">Your cart is elegantly empty</h2>
//         <p className="text-gray-600 mb-8 text-lg">Ready to discover exquisite pieces to adorn yourself?</p>
//         <Link 
//           to="/shop"
//           className="inline-block bg-amber-500 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors shadow-xl"
//         >
//           Shop Now
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <ConfirmationModal />

//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-400">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
//             <p className="text-gray-900 text-center">Updating your cart...</p>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-8 md:mb-12">
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Your Cart</h1>
//           <button onClick={() => navigate('/shop')} className="text-amber-600 font-semibold underline hover:text-amber-700 transition-colors text-lg">
//             Continue Shopping →
//           </button>
//         </div>

//         <div className="space-y-6 max-w-4xl mx-auto">
//           {cart.map((item) => (
//             <div key={item._id} className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-amber-500/20 transition-shadow">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                
//                 {/* Item Image & Details */}
//                 <div className="flex items-center space-x-4 flex-1 md:flex-row">
//                   <img 
//                     src={item.image} 
//                     alt={item.name} 
//                     className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md flex-shrink-0 border border-gray-700"
//                     onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/0F172A/E5E7EB?text=Jewel" }}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-serif font-semibold text-amber-400 text-xl truncate">{item.name}</h3>
//                     <p className="text-gray-400 mt-1">${Number(item.price).toFixed(2)} each</p>
//                   </div>
//                 </div>

//                 {/* Quantity, Subtotal, Remove */}
//                 <div className="flex items-center justify-between md:justify-end space-x-4 mt-4 md:mt-0">
//                   <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
//                     <button 
//                       onClick={() => updateCartItem(item._id, item.quantity - 1)}
//                       disabled={loading}
//                       className="bg-gray-700 text-gray-100 px-3 py-2 rounded-l-lg disabled:opacity-50 hover:bg-gray-600 transition-colors disabled:cursor-not-allowed"
//                     >
//                       −
//                     </button>
//                     <span className="px-4 py-2 bg-gray-900 text-amber-400 border border-gray-700 min-w-[3rem] text-center font-medium">{item.quantity}</span>
//                     <button 
//                       onClick={() => updateCartItem(item._id, item.quantity + 1)}
//                       disabled={loading}
//                       className="bg-gray-700 text-gray-100 px-3 py-2 rounded-r-lg disabled:opacity-50 hover:bg-gray-600 transition-colors disabled:cursor-not-allowed"
//                     >
//                       +
//                     </button>
//                   </div>

//                   <p className="font-serif font-bold text-amber-400 text-xl min-w-[80px] text-right md:text-left">
//                     ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
//                   </p>

//                   <button 
//                     onClick={() => handleRemoveItem(item._id)} 
//                     disabled={loading}
//                     className="bg-red-600 text-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm shadow-md"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Total & Actions */}
//         <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl shadow-2xl border border-amber-500/30 mt-8">
//           <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
//             <span className="text-xl font-semibold text-gray-200">Order Subtotal ({cart.length} items):</span>
//             <span className="text-3xl md:text-4xl font-serif font-bold text-amber-400">${calculateTotal()}</span>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button 
//               onClick={handleClearCart} 
//               disabled={loading} 
//               className="flex-1 bg-gray-700 text-gray-100 py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//             >
//               Clear Cart
//             </button>
//             <button 
//               onClick={handleCheckout} 
//               disabled={loading || cart.length === 0} 
//               className="flex-1 bg-amber-500 text-gray-900 py-3 px-6 rounded-lg font-serif font-bold text-lg hover:bg-amber-600 transition-colors shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//           <p className="text-sm text-gray-500 mt-4 text-center">(Your cart items are saved locally in your browser.)</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
