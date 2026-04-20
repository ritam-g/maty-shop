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

/**
 * Express application instance
 * Configures middleware, authentication, and route handlers
 */
const app = express();

// Middleware configuration
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cokkieParser()); // Parse cookies
app.use(passport.initialize()); // Initialize Passport authentication

/**
 * Google OAuth Strategy Configuration
 * Handles authentication via Google OAuth 2.0
 * Receives access token, refresh token, and user profile from Google
 */
passport.use(new GoogleStrategy({
    clientID: AppConfig.CLIENT_ID,
    clientSecret: AppConfig.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
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
app.use(`/api/cart`,cartRouter)
// Global error handler middleware
app.use(globalErrorHandler);

export default app;
