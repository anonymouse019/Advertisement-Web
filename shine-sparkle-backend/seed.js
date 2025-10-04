const mongoose = require('mongoose');
const Product = require('./models/Product');  // Assumes models/Product.js exists

// Direct DB Connection (no config/db.js needed)
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/shine-sparkle', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected for seeding');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
};

// Sample Jewelry Data (elegant gold/diamond theme, matching Figma)
const products = [
  {
    name: 'Diamond Eternity Necklace',
    description: 'Timeless diamond necklace for everyday elegance.',
    price: 299.99,
    category: 'Necklace',
    image: 'https://images.unsplash.com/photo-1512968558200-3d7c5d5b3f0d?w=400&fit=crop',
    stock: 15,
    featured: true
  },
  {
    name: 'Gold Hoop Earrings',
    description: 'Classic gold hoops with subtle sparkle.',
    price: 149.50,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1573957035912-3e0c16e0a4e4?w=400&fit=crop',
    stock: 20,
    featured: true
  },
  {
    name: 'Ruby Solitaire Ring',
    description: 'Vibrant ruby ring symbolizing passion and luxury.',
    price: 450.00,
    category: 'Ring',
    image: 'https://images.unsplash.com/photo-1556228574-6b8e9b0a8a0e?w=400&fit=crop',
    stock: 8,
    featured: true
  },
  {
    name: 'Pearl Tennis Bracelet',
    description: 'Elegant pearl bracelet for sophisticated wrists.',
    price: 220.75,
    category: 'Bracelet',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=400&fit=crop',
    stock: 12,
    featured: true
  },
  {
    name: 'Sapphire Drop Pendant',
    description: 'Deep blue sapphire pendant on gold chain.',
    price: 380.00,
    category: 'Pendant',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=400&fit=crop',
    stock: 10,
    featured: true
  },
  {
    name: 'Emerald Stud Earrings',
    description: 'Luxurious emerald studs for a pop of green.',
    price: 280.25,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=400&fit=crop',
    stock: 18,
    featured: false
  },
  {
    name: 'Silver Anklet',
    description: 'Delicate silver anklet with charm details.',
    price: 85.00,
    category: 'Bracelet',
    stock: 25,
    featured: false,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=400&fit=crop'
  }
  // Add more products here if needed (e.g., for Shop page variety)
];

// Clear existing products and seed new ones
const seedDB = async () => {
  try {
    await connectDB();  // Connect first
    
    // Clear old data
    await Product.deleteMany({});
    console.log('Existing products cleared');
    
    // Insert new data
    await Product.insertMany(products);
    console.log(`Seeding successful! Added ${products.length} products.`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('DB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

// Run the seeder
seedDB();