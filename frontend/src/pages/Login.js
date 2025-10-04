import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Login data:', data);  // Debug log
      const res = await axios.post('http://localhost:5000/api/login', {
        email: data.email,
        password: data.password
      });
      console.log('Login success:', res.data);  // Debug

      // Store token and user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Update global user state (via App.js context or props; for now, redirect)
      setMessage('Login successful! Redirecting...');
      reset();
      setTimeout(() => navigate('/'), 1500);  // Redirect to Home

    } catch (err) {
     console.error('Full Login error:', err.response);  // {status: 400, data: {msg: '...'}}
     const errorMsg = err.response?.data?.msg || 'Login failed.';
     setMessage(errorMsg);  // E.g., "Please verify your email first"
   }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold elegant text-gray-900">
            Sign in to Shine & Sparkle
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Access your personalized jewelry collection.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit(onSubmit)}>
          {message && (
            <div className={`p-3 rounded-md text-sm font-medium ${
              message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm ${
                  errors.password ? 'border-red-500' : ''
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-gold hover:text-gold-dark font-medium">
              Don't have an account? Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;