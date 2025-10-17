import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (location.state?.productName) {
      setFormData(prev => ({
        ...prev,
        subject: `Order Inquiry: ${location.state.productName}`,
      }));
      setProductDetails({
        name: location.state.productName,
        image: location.state.productImage,
      });
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        'service_k9813vo',
        'template_lg2ai6o',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'tsh88XG0RTkvC3EE0'
      )
      .then(
        (result) => {
          console.log(result.text);
          setStatus('✅ Message sent successfully!');
          setFormData({ name: '', email: '', subject: '', message: '' });
        },
        (error) => {
          console.error(error.text);
          setStatus('❌ Failed to send message. Please try again.');
        }
      );
  };

  return (
    <section className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            We’d love to hear from you! Whether you have a question, need assistance,
            or want to know more about our jewelry collections — we’re here to help.
          </p>
        </div>

        {/* If redirected from Shop, show product preview */}
        {productDetails && (
          <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center gap-6">
            <img
              src={productDetails.image || 'https://via.placeholder.com/200x150?text=No+Image'}
              alt={productDetails.name}
              className="w-40 h-40 object-cover rounded-lg border"
            />
            <div>
              <h3 className="text-xl font-semibold text-[#d4af37] mb-2">
                Interested in: {productDetails.name}
              </h3>
              <p className="text-gray-600">
                Fill out the form below and we’ll get back to you soon about this piece.
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#0b1733] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Get in Touch
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Feel free to reach out through any of the following channels, or fill out our form to send us a direct message.
            </p>

            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-[#d4af37]" size={20} />
              <span className="text-gray-700">123 Sparkle Avenue, Makati City, Philippines</span>
            </div>

            <div className="flex items-center space-x-4">
              <FaPhone className="text-[#d4af37]" size={20} />
              <span className="text-gray-700">+63 912 345 6789</span>
            </div>

            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-[#d4af37]" size={20} />
              <span className="text-gray-700">shineandsparkle@gmail.com</span>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-2">Business Hours</h3>
              <p className="text-gray-700">Monday – Saturday: 9:00 AM – 7:00 PM</p>
              <p className="text-gray-700">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0b1733] text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Send Us a Message
            </h2>

            <form className="space-y-4" onSubmit={sendEmail}>
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-white text-[#0b1733] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-white text-[#0b1733] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-white text-[#0b1733] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  placeholder="Subject of your message"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 rounded bg-white text-[#0b1733] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  placeholder="Type your message..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#d4af37] text-[#0b1733] font-semibold py-3 rounded hover:bg-[#c29e30] transition"
              >
                Send Message
              </button>

              {status && (
                <p className="mt-4 text-center text-sm text-[#d4af37]">{status}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
