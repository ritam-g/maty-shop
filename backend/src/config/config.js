import { config } from 'dotenv'

/**
 * Loads environment variables from .env file into process.env
 */
config()

/**
 * Environment variable validation
 * Ensures all required environment variables are defined before application startup
 */
if (process.env.MONGO_URL === undefined) throw new Error('MONGO_URL is not defined')
if (process.env.JWT_SECRET === undefined) throw new Error('JWT_SECRET is not defined')
if (process.env.CLIENT_ID === undefined) throw new Error('CLIENT_ID is not defined')
if (process.env.CLIENT_SECRET === undefined) throw new Error('CLIENT_SECRET is not defined')
if (process.env.IMAGEKIT_PUBLIC_KEY === undefined) throw new Error('IMAGEKIT_PUBLIC_KEY is not defined')
if (process.env.IMAGEKIT_PRIVATE_KEY === undefined) throw new Error('IMAGEKIT_PRIVATE_KEY is not defined')
if (process.env.IMAGEKIT_URL_ENDPOINT === undefined) throw new Error('IMAGEKIT_URL_ENDPOINT is not defined')
if(process.env.REZOR_PAY_API_KEY=== undefined) throw new Error('REZOR_PAY_API_KEY is not defined')
if(process.env.REZOR_PAY_API_SECRET=== undefined) throw new Error('REZOR_PAY_API_SECRET is not defined')

/**
 * Application configuration object containing all environment variables
 * @typedef {Object} AppConfig
 * @property {string} PORT - Server port number
 * @property {string} MONGO_URL - MongoDB connection string
 * @property {string} JWT_SECRET - Secret key for JWT token signing
 * @property {string} JWT_EXPIRES_IN - JWT token expiration time
 * @property {string} React_APP_BASE_URL - Frontend application base URL
 * @property {string} CLIENT_ID - Google OAuth client ID
 * @property {string} CLIENT_SECRET - Google OAuth client secret
 * @property {string} IMAGEKIT_PUBLIC_KEY - ImageKit public API key
 * @property {string} IMAGEKIT_PRIVATE_KEY - ImageKit private API key
 * @property {string} IMAGEKIT_URL_ENDPOINT - ImageKit URL endpoint for image delivery
 * @property {string} FRONTEND_URL - Hardcoded production URL for Render
 */
const sanitizeEnv = (val) => {
    if (typeof val !== 'string') return val;
    return val.replace(/^["']|["']$/g, '').trim();
};

export const AppConfig = {
    PORT: sanitizeEnv(process.env.PORT),
    MONGO_URL: sanitizeEnv(process.env.MONGO_URL),
    JWT_SECRET: sanitizeEnv(process.env.JWT_SECRET),
    JWT_EXPIRES_IN: sanitizeEnv(process.env.JWT_EXPIRES_IN),
    React_APP_BASE_URL: sanitizeEnv(process.env.REACT_APP_BASE_URL),
    CLIENT_ID: sanitizeEnv(process.env.CLIENT_ID),
    CLIENT_SECRET: sanitizeEnv(process.env.CLIENT_SECRET),
    IMAGEKIT_PUBLIC_KEY: sanitizeEnv(process.env.IMAGEKIT_PUBLIC_KEY),
    IMAGEKIT_PRIVATE_KEY: sanitizeEnv(process.env.IMAGEKIT_PRIVATE_KEY),
    IMAGEKIT_URL_ENDPOINT: sanitizeEnv(process.env.IMAGEKIT_URL_ENDPOINT),
    FRONTEND_URL: 'https://maty-shop.onrender.com',
    REZOR_PAY_API_KEY: sanitizeEnv(process.env.REZOR_PAY_API_KEY),
    REZOR_PAY_API_SECRET: sanitizeEnv(process.env.REZOR_PAY_API_SECRET)
}


