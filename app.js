import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './auth.js';
import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Correctly get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/auth', authRoutes);

// ✅ Serve all static files (HTML, CSS, JS, images) from the same folder
app.use(express.static(__dirname));

// ✅ Fallback route: serve index.html for everything else
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
