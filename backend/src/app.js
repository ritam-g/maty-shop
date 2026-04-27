import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import authRouter from './routes/auth.route.js';
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { AppConfig } from './config/config.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';


// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Express application instance
 * Configures middleware, authentication, and route handlers
 */
const app = express();

/**
 * Trust proxy for Render load balancer
 * Required for rate limiting and secure cookies
 */
app.set('trust proxy', 1);

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS configuration - allows both local development and production URLs
 * 
 * LOCAL DEVELOPMENT URLs (Localhost):
 * - http://localhost:5173  (Vite default port)
 * - http://localhost:5174  (Alternative Vite port)
 * - http://localhost:3000  (Common development port)
 * 
 * PRODUCTION URLs (Render):
 * - https://maty-shop.onrender.com
 */
const allowedOrigins = [
    // LOCAL DEVELOPMENT
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    // PRODUCTION (RENDER)
    'https://maty-shop.onrender.com'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(cookieParser());
app.use(passport.initialize());

/**
 * Health check endpoint for Render
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});


// Serve static files from the public folder (React build)
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Google OAuth Strategy Configuration
 * Handles authentication via Google OAuth 2.0
 * 
 * CALLBACK URLS:
 * - LOCAL: http://localhost:5173/api/auth/google/callback (or your backend port)
 * - PRODUCTION (RENDER): https://maty-shop.onrender.com/api/auth/google/callback
 */
const getGoogleCallbackURL = () => {
    // if (process.env.GOOGLE_CALLBACK_URL) {
    //     return process.env.GOOGLE_CALLBACK_URL;
    // }

    // DEFAULT: Use production URL if env variable not set
    // return `http://localhost:5173/api/auth/google/callback`;// for local development
    return `https://maty-shop.onrender.com/api/auth/google/callback`;
};

passport.use(new GoogleStrategy({
    clientID: AppConfig.CLIENT_ID,
    clientSecret: AppConfig.CLIENT_SECRET,
    callbackURL: getGoogleCallbackURL()
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


// Route configuration
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

//! Fallback route for React Router - serve index.html for all non-API routes
//updating new build to public backend 
app.get('*any', (req, res) => {
    // If it's an API route that wasn't matched, don't serve index.html
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Global error handler middleware
app.use(globalErrorHandler);

export default app;
