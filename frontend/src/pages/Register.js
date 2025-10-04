 import React, { useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from 'yup';
  import axios from 'axios';
  import emailjs from '@emailjs/browser';
  import { Link, useNavigate } from 'react-router-dom';  // Hooks only
  import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For password toggle

// Validation Schema (Yup for strong rules)
const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
}).required();

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

   const onSubmit = async (data) => {
  setLoading(true);
  setMessage('');
  try {
    console.log('Register data being sent:', data);  // Line ~35: Logs {name?, email, password} - check if 'name' missing!
    const res = await axios.post('http://localhost:5000/api/register', {
      name: data.name,  // Explicit - ensures sent
      email: data.email,
      password: data.password
    });
    console.log('Register success:', res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setMessage('Registration successful! Please check your email to verify.');
    reset();
  } catch (err) {
    // Enhanced logging - shows exact backend reason
    console.error('Register 400 details:', {
      status: err.response?.status,
      message: err.response?.data?.msg,  // E.g., "Please fill all fields"
      fullResponse: err.response?.data,
      requestBody: data  // What was sent
    });
    const errorMsg = err.response?.data?.msg || 'Registration failed. Check console for details.';
    setMessage(errorMsg);  // Displays on page (e.g., red "Please fill all fields")
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold elegant text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Shine & Sparkle to discover timeless jewelry.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
          {message && (
            <div className={`p-3 rounded-md ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold ${errors.name ? 'border-red-500' : ''}`}
              placeholder="e.g., Jane Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold ${errors.email ? 'border-red-500' : ''}`}
              placeholder="e.g., jane@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold ${errors.password ? 'border-red-500' : ''}`}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Match your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-gold hover:text-yellow-400">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;