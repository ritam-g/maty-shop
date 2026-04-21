import express from 'express';
import cokkieParser from 'cookie-parser'
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

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Express application instance
 * Configures middleware, authentication, and route handlers
 */
const app = express();

// Middleware configuration
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cors({
    origin: `${AppConfig.FRONTEND_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cokkieParser()); // Parse cookies
app.use(passport.initialize()); // Initialize Passport authentication

// Serve static files from the public folder (React build)
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Google OAuth Strategy Configuration
 * Handles authentication via Google OAuth 2.0
 * Receives access token, refresh token, and user profile from Google
 */
const getGoogleCallbackURL = () => {
    if (process.env.GOOGLE_CALLBACK_URL) {
        return process.env.GOOGLE_CALLBACK_URL;
    }
    // For local development, default to localhost
    // For production, this should be set via environment variable
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.APP_HOST || 'localhost:3000';
    return `${protocol}://${host}/api/auth/google/callback`;
};

passport.use(new GoogleStrategy({
    clientID: AppConfig.CLIENT_ID,
    clientSecret: AppConfig.CLIENT_SECRET,
    callbackURL: getGoogleCallbackURL()
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    return done(null, profile)
}))

// TODO: Add CORS policy for frontend communication
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }))

// Route configuration
app.use('/api/auth', authRouter) // Authentication routes
app.use('/api/product', productRouter) // Product routes
app.use(`/api/cart`, cartRouter)

// Fallback route for React Router - serve index.html for all non-API routes
// This allows React Router to handle client-side routing on page refresh
app.get('*any', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global error handler middleware
app.use(globalErrorHandler);

export default app;
