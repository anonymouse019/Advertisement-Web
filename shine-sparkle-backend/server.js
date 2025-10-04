const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();  // Load .env

const User = require('./models/User');
const Product = require('./models/Product');

const app = express();

// ===== Middleware =====
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());

// ===== Environment Vars =====
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '262ecc52a3a855cde2833a2b011dcf940aa053e17ab6fa707b46e851111aad10';

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shine-sparkle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});

// ===== Email Transporter =====
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter error on startup:', error.message);
    } else {
      console.log('Email transporter ready - Gmail connected');
    }
  });
} catch (emailError) {
  console.error('Nodemailer setup error:', emailError.message);
  console.log('Emails disabled - continuing without Nodemailer');
  transporter = null;
}

// ===== JWT Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // { id: user._id }
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// ===== Products Routes =====
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Products Error:', err.message);
    res.status(500).json({ msg: 'Server error fetching products' });
  }
});

// Featured Products
app.get('/api/products/featured', async (req, res) => {
  try {
    // Example: return first 6 products
    const products = await Product.find().limit(6);
    res.json(products);
  } catch (err) {
    console.error('Featured Products Error:', err.message);
    res.status(500).json({ msg: 'Server error fetching featured products' });
  }
});

// ===== Auth Routes =====
// Register
app.post('/api/register', async (req, res) => {
  try {
    console.log('Register route hit - body:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      cart: []
    });

    await user.save();

    const verificationUrl = `http://localhost:3000/verify/${user._id}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Shine Sparkle Account',
      html: `
      <div style="margin:0;padding:0;background:#f9fafb;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;margin:20px auto;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);font-family:Arial,sans-serif;">
                
                <tr>
                  <td style="background:#facc15;padding:20px;border-radius:10px 10px 0 0;text-align:center;">
                    <h2 style="margin:0;font-size:24px;color:#111;">✨ Shine & Sparkle Jewelry ✨</h2>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding:30px;text-align:center;color:#333;">
                    <h3 style="margin-bottom:15px;">Welcome, ${name}!</h3>
                    <p style="font-size:16px;line-height:1.6;margin:0 0 20px;">
                      Thank you for registering at <strong>Shine & Sparkle</strong>.  
                      Please confirm your email address to activate your account.
                    </p>
                    
                    <a href="${verificationUrl}" target="_blank"
                      style="display:inline-block;margin-top:20px;padding:14px 28px;
                             background:#facc15;color:#111;font-weight:bold;
                             text-decoration:none;border-radius:8px;
                             font-size:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                      ✅ Verify My Email
                    </a>
                    
                    <p style="margin-top:25px;font-size:14px;color:#555;">
                      If you did not create this account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="background:#f9fafb;padding:15px;text-align:center;border-radius:0 0 10px 10px;font-size:12px;color:#777;">
                    &copy; ${new Date().getFullYear()} Shine & Sparkle Jewelry. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      `
    };

    if (transporter) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email send error:', error.message);
        } else {
          console.log('Verification email sent:', info.response);
        }
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        cart: user.cart
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// Verify Email
app.put('/api/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id, 
      { isVerified: true }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User verified successfully' });
  } catch (err) {
    console.error('Verify Error:', err.message);
    res.status(500).json({ msg: 'Server error during verification' });
  }
});

// ===== Cart Routes (Protected) =====
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ cart: user.cart, total: total.toFixed(2) });
  } catch (err) {
    console.error('Get Cart Error:', err.message);
    res.status(500).json({ msg: 'Server error fetching cart' });
  }
});

app.post('/api/cart/add', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const existingItem = user.cart.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }

    await user.save();
    const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ msg: 'Item added to cart', cart: user.cart, total: total.toFixed(2) });
  } catch (err) {
    console.error('Add to Cart Error:', err.message);
    res.status(500).json({ msg: 'Server error adding to cart' });
  }
});

app.put('/api/cart/update/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: 'Valid quantity required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const item = user.cart.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not in cart' });
    }

    item.quantity = quantity;
    await user.save();
    const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ msg: 'Cart updated', cart: user.cart, total: total.toFixed(2) });
  } catch (err) {
    console.error('Update Cart Error:', err.message);
    res.status(500).json({ msg: 'Server error updating cart' });
  }
});

app.delete('/api/cart/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not in cart' });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();
    const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ msg: 'Item removed from cart', cart: user.cart, total: total.toFixed(2) });
  } catch (err) {
    console.error('Remove from Cart Error:', err.message);
    res.status(500).json({ msg: 'Server error removing from cart' });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
