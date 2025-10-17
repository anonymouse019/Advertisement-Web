import React from 'react';

const About = () => {
  return (
    <section className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About Shine & Sparkle
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Where elegance meets timeless beauty — crafted to make you shine brighter every day.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="ab.jpg"
              alt="Jewelry display"
              className="rounded-2xl shadow-lg w-full md:w-4/5"
            />
          </div>

          {/* Text */}
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#0b1733] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Shine & Sparkle began with a passion for crafting jewelry that reflects both
              modern sophistication and classic charm. Every piece is carefully designed
              to capture elegance, confidence, and individuality.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              From radiant gold to shimmering silver, our collections are inspired by
              life’s most precious moments — designed for those who love to express
              themselves through beauty and brilliance.
            </p>

            <h3
              className="text-xl font-semibold text-[#d4af37] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To create elegant and affordable jewelry that empowers everyone to feel
              confident, beautiful, and truly shine in their own unique way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
