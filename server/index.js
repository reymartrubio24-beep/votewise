const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const candidateRoutes = require('./src/routes/candidateRoutes');
const voterRoutes = require('./src/routes/voterRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Routes
app.use('/api', authRoutes);      // /api/auth/login, /api/elections, /api/admin/elections
app.use('/api', candidateRoutes); // /api/admin/positions, /api/admin/candidates
app.use('/api', voterRoutes);    // /api/results/all, /api/votes, /api/admin/voters, /api/admin/stats

// Root
app.get('/', (req, res) => res.json({ message: 'VoteWise API Running' }));

// Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
