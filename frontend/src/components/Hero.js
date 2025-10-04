import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // For CTA arrow

// Sample slide data (matching Figma: 3 slides with jewelry focus)
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1512968558200-3d7c5d5b3f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', // Necklace hero
    title: 'Discover Timeless Elegance',
    subtitle: 'Indulge in the sparkle of fine jewelry crafted for every occasion.',
    cta: 'Shop Necklaces',
    link: '/shop?category=necklace'
  },
  {
    image: 'https://images.unsplash.com/photo-1573957035912-3e0c16e0a4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Earrings
    title: 'Shine with Confidence',
    subtitle: 'Elevate your style with our exquisite collection of earrings and rings.',
    cta: 'Explore Earrings',
    link: '/shop?category=earrings'
  },
  {
    image: 'https://images.unsplash.com/photo-1556228574-6b8e9b0a8a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Rings/Bracelets
    title: 'Sparkle Forever',
    subtitle: 'Gifts that last a lifetime—perfect for celebrations and everyday luxury.',
    cta: 'View All',
    link: '/shop'
  }
];

const Hero = ({ addToCart }) => { // addToCart prop passed from Home (though not used in hero)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false, // Hide arrows for clean Figma look; use dots
    fade: true, // Smooth fade transition
    cssEase: 'linear'
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-screen w-full">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay Gradient for Text Readability (gold tint matching Figma) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-gold/20"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 text-center text-white">
              <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold elegant leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="inline-flex items-center bg-gold text-black px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {slide.cta} <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Optional: Scroll Indicator (subtle, matching Figma's smooth flow) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;