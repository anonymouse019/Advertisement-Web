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
    image: 'https://cdn.shopify.com/s/files/1/0364/7253/products/Web_IMG_4334-Edit_706x918_crop_center.jpg?v=1665499242',
    stock: 15,
    featured: true
  },
  {
    name: 'Gold Hoop Earrings',
    description: 'Classic gold hoops with subtle sparkle.',
    price: 149.50,
    category: 'Earrings',
    image: 'https://i.pinimg.com/originals/a4/53/f4/a453f4a4d373f2c4d83d9124db904512.jpg',
    stock: 20,
    featured: true
  },
  {
    name: 'Ruby Solitaire Ring',
    description: 'Vibrant ruby ring symbolizing passion and luxury.',
    price: 450.00,
    category: 'Ring',
    image: 'https://a.1stdibscdn.com/82-carat-natural-vivid-bright-ruby-solitaire-ring-and-band-14-karat-for-sale-picture-3/j_11863/1537999749459/2284_6_master.JPG?width=768',
    stock: 8,
    featured: true
  },
  {
    name: 'Pearl Tennis Bracelet',
    description: 'Elegant pearl bracelet for sophisticated wrists.',
    price: 220.75,
    category: 'Bracelet',
    image: 'https://static.helloice.com/productimages/2024/6/HLB10048/1797485039110459392.jpeg',
    stock: 12,
    featured: true
  },
  {
    name: 'Sapphire Drop Pendant',
    description: 'Deep blue sapphire pendant on gold chain.',
    price: 380.00,
    category: 'Pendant',
    image: 'https://a.1stdibscdn.com/angara-gia-certified-natural-sapphire-yellow-gold-pendant-necklace-for-sale/22569652/j_178830521670504782464/j_17883052_1670504782793_bg_processed.jpg',
    stock: 10,
    featured: true
  },
  {
    name: 'Emerald Stud Earrings',
    description: 'Luxurious emerald studs for a pop of green.',
    price: 280.25,
    category: 'Earrings',
    image: 'https://i.etsystatic.com/23490555/r/il/c71f7f/2886094284/il_fullxfull.2886094284_pvmy.jpg',
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
    image: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/fe3c1bea-d810-4949-a270-6d44d00c5fd0.__CR0,1379,4672,1915_PT0_SX1464_V1___.jpg'
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