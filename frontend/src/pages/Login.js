import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// Removed: import { FaEye, FaEyeSlash } from 'react-icons/fa'; -> Replaced with inline SVGs

// Define the validation schema using Yup
const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
}).required();

/* * NOTE: This component assumes custom Tailwind configuration for:
 * - gold-500 (e.g., #D4AF37)
 * - navy-900 (e.g., #0A1931)
 * - elegant-font (e.g., 'Playfair Display' or similar serif font)
 */

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Simple loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Inline SVG for Eye (Show Password)
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  // Inline SVG for Eye Slash (Hide Password)
  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17.94 17.94A10.74 10.74 0 0 1 12 19c-7 0-10-7-10-7a11.64 11.64 0 0 1 3.25-4.47l-1.5-1.5c-1.37 1.5-2.25 3.55-2.75 5.97a.5.5 0 0 0 0 .04"/>
      <path d="M10.53 10.53a3 3 0 1 0 5.17 5.17"/>
      <line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  );

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Login data:', data); 
      const res = await axios.post('http://localhost:5000/api/login', {
        email: data.email,
        password: data.password
      });
      
      console.log('Login success:', res.data); 

      // Store token and user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMessage('Login successful! Redirecting...');
      reset();
      // Use navigate to redirect
      setTimeout(() => navigate('/'), 1500); 

    } catch (err) {
      console.error('Full Login error:', err.response); 
      // Enhanced error message extraction
      const errorMsg = err.response?.data?.msg || err.message || 'Login failed. Please check your network connection.';
      setMessage(errorMsg); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold elegant-font text-navy-900 tracking-wider">
            Login to Shine & Sparkle
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Access your personalized fine jewelry collection.
          </p>
        </div>
        <form 
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-2xl border border-gray-100" 
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg border text-sm font-medium ${
              message.includes('successful') 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : 'bg-red-100 text-red-700 border-red-300'
            }`}>
              {message}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`mt-1 appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm transition duration-150 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.email.message}</p>}
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`mt-1 appearance-none relative block w-full px-4 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm transition duration-150 ${
                  errors.password ? 'border-red-500' : ''
                }`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-9 transform -translate-y-1/2 mt-3 mr-3 flex items-center text-gray-500 hover:text-navy-900 transition"
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-gold-500 hover:text-gold-600 transition">
                  Forgot your password?
                </Link>
              </div>
            </div>

          </div> 

          <div>
            {/* Submit Button with Loading Spinner */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-navy-900 bg-gold-500 uppercase tracking-wider hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm text-gray-600 hover:text-navy-900 transition">
              Don't have an account? 
              <span className="font-bold text-gold-500 hover:text-gold-600 ml-1">
                Register here
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
