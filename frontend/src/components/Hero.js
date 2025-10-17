import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Custom Styles for Blue/Gold Theme ---
const CustomStyles = () => (
  <style>
    {`
      .bg-navy-900 { background-color: #0A1931; }
      .text-gold-500 { color: #D4AF37; }
      .bg-gold-500 { background-color: #D4AF37; }

      body {
        font-family: 'Inter', sans-serif;
        color: #333;
      }
      .elegant-font {
        font-family: 'Playfair Display', serif;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
      }
    `}
  </style>
);

// Inline SVG Icons
const ArrowRight = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
const ChevronLeft = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Slide Data
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1549725807-6c84f69903e6?q=80&w=2070&auto=format&fit=crop',
    title: 'The Signature Collection',
    subtitle: 'Timeless diamond and gold pieces crafted for generations.',
    cta: 'Message Us to Order',
  },
  {
    image: 'https://images.unsplash.com/photo-1520165971481-893321516e81?q=80&w=2070&auto=format&fit=crop',
    title: 'Engagement Rings Reimagined',
    subtitle: 'Find the perfect symbol of forever in our exclusive bridal range.',
    cta: 'Contact Us Now',
  },
  {
    image: 'https://images.unsplash.com/photo-1602102198086-4f40f0653063?q=80&w=2070&auto=format&fit=crop',
    title: 'Everyday Luxury',
    subtitle: 'Experience the subtle elegance of our minimalist fine jewelry.',
    cta: 'Talk to Us',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  // Redirect to Contact.js
  const handleRedirect = () => navigate('/contact');

  return (
    <section className="relative h-[80vh] md:h-screen w-full overflow-hidden">
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
            style={{
              backgroundImage: `url(${s.image})`,
              transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-black/40"></div>
          </div>

          {/* Slide Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-6 bg-black/30 p-8 rounded-xl backdrop-blur-sm shadow-2xl">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl elegant-font leading-tight">
                {s.title}
              </h1>
              <p className="text-base sm:text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto">
                {s.subtitle}
              </p>
              <button
                onClick={handleRedirect}
                className="inline-flex items-center bg-gold-500 text-navy-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-yellow-400 transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
              >
                {s.cta} <ArrowRight className="ml-3 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/60 rounded-full hidden md:block"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/60 rounded-full hidden md:block"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
              idx === currentIndex
                ? 'bg-gold-500 scale-125 border-gold-500'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Wrapper with custom styles + footer
const App = () => (
  <>
    <CustomStyles />
    <Hero />
    <div className="bg-navy-900 text-gray-300 py-12 px-8 text-center">
      <h2 className="text-2xl elegant-font text-gold-500 mb-2">Shine Sparkle Jewelry</h2>
      <p className="text-sm">Experience luxury. Delivered to your doorstep.</p>
    </div>
  </>
);

export default App;
