const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Paths
const dataFilePath = path.join(__dirname, 'data', 'portfolio.json');
const messagesFilePath = path.join(__dirname, 'data', 'messages.json');

// Helper to load portfolio data
function getPortfolioData() {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading portfolio.json:', err);
    return null;
  }
}

// API Routes
app.get('/api/portfolio', (req, res) => {
  const data = getPortfolioData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to load portfolio data' });
  }
  res.json(data);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    app: "Triveni Naik Portfolio"
  });
});

// Contact Form submission endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields (Name, Email, and Message).'
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  const newMessage = {
    id: 'msg_' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  try {
    let messages = [];
    if (fs.existsSync(messagesFilePath)) {
      const existing = fs.readFileSync(messagesFilePath, 'utf8');
      if (existing) {
        messages = JSON.parse(existing);
      }
    }
    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving contact message:', err);
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you for reaching out! Triveni has received your message and will respond shortly.',
    data: {
      name: newMessage.name,
      receivedAt: newMessage.receivedAt
    }
  });
});

// Page Routes for Separate Section Pages
const pageRoutes = [
  { path: '/', file: 'index.html' },
  { path: '/personal-info', file: 'personal-info.html' },
  { path: '/education', file: 'education.html' },
  { path: '/skills', file: 'skills.html' },
  { path: '/projects', file: 'projects.html' },
  { path: '/certificates', file: 'certificates.html' },
  { path: '/achievements', file: 'achievements.html' },
  { path: '/experience', file: 'experience.html' },
  { path: '/contact', file: 'contact.html' }
];

pageRoutes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', route.file));
  });
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server with graceful port handling
function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`====================================================`);
    console.log(`  Triveni Naik Portfolio Web Application`);
    console.log(`  Server running on http://localhost:${portToUse}`);
    console.log(`  Health Check: http://localhost:${portToUse}/api/health`);
    console.log(`  API Data: http://localhost:${portToUse}/api/portfolio`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${portToUse} is in use. Trying port ${Number(portToUse) + 1}...`);
      startServer(Number(portToUse) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);

