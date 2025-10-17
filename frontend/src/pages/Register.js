import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com'; // ✅ NEW IMPORT

// Validation Schema
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

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.74 10.74 0 0 1 12 19c-7 0-10-7-10-7a11.64 11.64 0 0 1 3.25-4.47l-1.5-1.5c-1.37 1.5-2.25 3.55-2.75 5.97a.5.5 0 0 0 0 .04" />
      <path d="M10.53 10.53a3 3 0 1 0 5.17 5.17" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      // ✅ Step 1: Register user in backend
      const res = await axios.post('http://localhost:5000/api/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      // ✅ Step 2: Send Welcome Email
      await emailjs.send(
        'service_k9813vo',       // your EmailJS service ID
        'template_g197ecf',        // your EmailJS template ID
        {
          name: data.name,
          email: data.email,
        },
        'tsh88XG0RTkvC3EE0'                // your EmailJS public key
      );

      // ✅ Step 3: Store and redirect
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Registration successful! Check your email for a welcome message.');
      reset();
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      console.error('Register error:', err);
      const errorMsg = err.response?.data?.msg || 'Registration failed. Please try again.';
      setMessage(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold elegant-font text-navy-900 tracking-wider">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Shine & Sparkle to discover your next timeless piece.
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-2xl border border-gray-100" onSubmit={handleSubmit(onSubmit)}>
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
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" type="text" {...register('name')} placeholder="e.g., Jane Doe"
                className={`mt-1 block w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-gold-500 focus:border-gold-500`} disabled={loading}/>
              {errors.name && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input id="email" type="email" {...register('email')} placeholder="e.g., jane@example.com"
                className={`mt-1 block w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-gold-500 focus:border-gold-500`} disabled={loading}/>
              {errors.email && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="At least 8 characters"
                className={`mt-1 block w-full px-4 py-3 border rounded-lg pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-gold-500 focus:border-gold-500`} disabled={loading}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-navy-900">
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="Match your password"
                className={`mt-1 block w-full px-4 py-3 border rounded-lg pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-gold-500 focus:border-gold-500`} disabled={loading}/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-navy-900">
                {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 text-sm font-bold rounded-lg text-navy-900 bg-gold-500 uppercase tracking-wider hover:bg-gold-600 focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition duration-300 disabled:opacity-60 shadow-lg">
              {loading ? (<><LoadingSpinner />Creating Account...</>) : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-gray-600 hover:text-navy-900 transition">
              Already have an account? 
              <span className="font-bold text-gold-500 hover:text-gold-600 ml-1">Sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
