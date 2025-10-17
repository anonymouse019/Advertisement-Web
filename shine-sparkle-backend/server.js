const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const productRoutes = require('./routes/ProductRoutes');

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://shine-sparkle.vercel.app',
  credentials: true
}));
app.use(express.json());

// ===== Product Routes =====
app.use('/api/products', productRoutes);

// ===== Environment Vars =====
const JWT_SECRET = process.env.JWT_SECRET || '262ecc52a3a855cde2833a2b011dcf940aa053e17ab6fa707b46e851111aad10';

// ===== MongoDB Connection =====
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shine-sparkle', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));
}

// ===== Email Transporter =====
let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    transporter.verify((error) => {
      if (error) console.error('Email transporter error:', error.message);
      else console.log('📧 Email transporter ready');
    });
  }
} catch (emailError) {
  console.error('Nodemailer setup error:', emailError.message);
}

// ===== JWT Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// ===== Product Routes (for frontend display) =====
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find().limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching featured products' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== Auth Routes =====
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    await user.save();

    // Send verification email
    if (transporter) {
      const verificationUrl = `${process.env.CLIENT_URL || 'https://shine-sparkle.vercel.app'}/verify/${user._id}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Shine Sparkle Account',
        html: `<p>Hi ${name}, please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) console.error('Email send error:', error.message);
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: 'Please fill all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// Verify Email
app.put('/api/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: 'Invalid verification link' });

    const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({ msg: 'User verified successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error during verification' });
  }
});

// ===== Redirect old /api/cart routes =====
app.use('/api/cart', (req, res) => {
  res.status(301).json({
    redirect: '/contact',
    msg: '🛍️ Cart feature disabled. Please reach out via the Contact page.'
  });
});

// ===== Export app for Vercel =====
module.exports = app;
