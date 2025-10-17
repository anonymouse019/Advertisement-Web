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

// ===== Optimized MongoDB Connection =====
let dbConnection = null;

async function connectDB() {
  if (dbConnection) return dbConnection;  // Reuse existing connection
  try {
    dbConnection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shine-sparkle', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
    return dbConnection;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    throw err;  // Let this propagate for error handling
  }
}


// ===== Middleware =====
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',  // For local development
      process.env.CLIENT_URL || 'https://shine-sparkle.vercel.app',
      'https://shine-sparkle-gqd6c7tff-katrine-kate-s-projects.vercel.app'  // Your Vercel deployment URL
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ===== Product Routes =====
app.use('/api/products', productRoutes);

// ===== Environment Vars =====
const JWT_SECRET = process.env.JWT_SECRET || '262ecc52a3a855cde2833a2b011dcf940aa053e17ab6fa707b46e851111aad10';

// ===== JWT Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // { id: user._id }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// ===== Product Routes (for frontend display) =====
app.get('/api/products/featured', async (req, res) => {
  try {
    await connectDB();  // Ensure DB is connected
    const products = await Product.find().limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching featured products' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    await connectDB();  // Ensure DB is connected
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    await connectDB();  // Ensure DB is connected
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

    await connectDB();  // Ensure DB is connected
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
const generateSubscriptionEmail = (name, email) => `
  <div style="max-width:600px;margin:20px auto;padding:20px;
              border-radius:10px;background:#ffffff;
              font-family:Arial, sans-serif;
              box-shadow:0 4px 12px rgba(0,0,0,0.1);">

    <div style="background:#facc15;padding:15px 20px;border-radius:8px 8px 0 0;
                text-align:center;color:#111;font-size:22px;font-weight:bold;">
      ✨ Thanks for Subscribing to Shine & Sparkle! ✨
    </div>

    <div style="padding:20px;">
      <p style="font-size:16px;color:#333;margin:0 0 15px;">
        Hello <strong>${name || 'Sparkling Friend'}</strong> 👋,
      </p>

      <p style="font-size:16px;color:#333;margin:0 0 15px;">
        Thank you for subscribing to our newsletter!
      </p>

      <p style="font-size:16px;color:#333;margin:0 0 15px;">
        You’ll now be the first to know about our newest jewelry collections, special offers, and exclusive sparkle tips.
      </p>

      <p style="font-size:16px;color:#333;margin:0 0 15px;">
        We’re thrilled to have you with us. ✨
      </p>

      <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:15px;color:#555;line-height:1.6;">
        If you have any questions or simply want to say hi, just reply to this email — we’d love to hear from you!
      </p>
    </div>

    <div style="background:#f9fafb;padding:15px 20px;text-align:center;
                border-top:1px solid #eee;border-radius:0 0 8px 8px;
                font-size:12px;color:#666;">
      This is a thank-you email from <strong>Shine & Sparkle Jewelry</strong>.<br />
      <em>Stay radiant. Stay elegant. Stay sparkling. ✨</em>
    </div>
  </div>
`;
app.post('/api/subscribe', async (req, res) => {
  const { email, name } = req.body;

  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Compose and send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✨ Thanks for Subscribing to Shine & Sparkle!',
      html: generateSubscriptionEmail(name, email)
    });

    res.status(200).json({ msg: 'Subscription confirmation email sent successfully' });
  } catch (err) {
    console.error('❌ Email error:', err.message);
    res.status(500).json({ msg: 'Error sending subscription email' });
  }
});
    // Send verification email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

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

    await connectDB();  // Ensure DB is connected
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

    await connectDB();  // Ensure DB is connected
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

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error for debugging
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// ===== Export app for Vercel =====
module.exports = app;