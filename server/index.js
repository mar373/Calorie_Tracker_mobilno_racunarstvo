require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:8081',  // Expo web
        'http://localhost:19006', // Expo web (stari port)
        'http://localhost:3000',  // alternativni frontend port
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Calorie Tracker API radi',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.method} ${req.path} nije pronađena.` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Interna greška servera.' });
});

app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Calorie Tracker API Server');
    console.log(`📡 Sluša na: http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('Dostupni endpointi:');
    console.log('  POST /auth/register');
    console.log('  POST /auth/login');
    console.log('  GET  /logs         (JWT required)');
    console.log('  POST /logs         (JWT required)');
    console.log('  PUT  /logs/:id     (JWT required)');
    console.log('  DELETE /logs/:id   (JWT required)');
    console.log('  GET  /logs/goal    (JWT required)');
    console.log('  PUT  /logs/goal    (JWT required)');
    console.log('');
});

module.exports = app;
