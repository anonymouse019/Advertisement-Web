import React from 'react';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="container mx-auto px-4 text-center">
      <p>&copy; 2024 Shine & Sparkle Jewelry. All rights reserved.</p>
      <div className="mt-4 space-x-4">
        <a href="/about" className="hover:text-gold">About</a>
        <a href="/contact" className="hover:text-gold">Contact</a>
        <a href="/privacy" className="hover:text-gold">Privacy</a>
      </div>
    </div>
  </footer>
);

export default Footer;