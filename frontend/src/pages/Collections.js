import React from 'react';

const Collections = () => {
  // Sample jewelry collections (you can replace with your real data later)
  const collections = [
    {
      title: 'Gold Elegance',
      description: 'Classic gold pieces designed to shine with timeless beauty.',
      image: 'https://img.freepik.com/premium-photo/wealthy-elegance-shiny-gold-jewelry_1077802-19428.jpg',
    },
    {
      title: 'Diamond Dreams',
      description: 'Sparkling diamond jewelry that radiates sophistication and grace.',
      image: 'https://i.pinimg.com/736x/fb/bf/3b/fbbf3b2443d277fc7618daa4153d5e17.jpg',
    },
    {
      title: 'Silver Charm',
      description: 'Delicate silver designs that bring subtle elegance to any look.',
      image: 'https://i.pinimg.com/originals/5e/b6/fe/5eb6feaa720e2b6bf354d576f6dfd66c.jpg',
    },
    {
      title: 'Pearl Perfection',
      description: 'Pure, graceful pearls for a look of timeless sophistication.',
      image: 'https://cdn.shopify.com/s/files/1/2297/8897/files/2_e5352f80-444d-4977-a325-163cc8c5ec9b.webp?v=1705566003',
    },
  ];

  return (
    <section className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Collections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Explore our curated jewelry collections — crafted to reflect luxury,
            elegance, and your personal shine.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((item, index) => (
            <div
              key={index}
              className="bg-[#0b1733] rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 text-center">
                <h2
                  className="text-xl font-semibold text-[#d4af37] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h2>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3
            className="text-2xl font-bold text-[#0b1733] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Find Your Perfect Piece?
          </h3>
          <p className="text-gray-700 mb-6">
            Discover the beauty that speaks to you — explore our shop and make your style shine.
          </p>
          <a
            href="/shop"
            className="bg-[#d4af37] text-[#0b1733] px-6 py-3 rounded font-semibold hover:bg-[#c29e30] transition"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Collections;
