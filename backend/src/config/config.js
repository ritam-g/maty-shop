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
 */
export const AppConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    React_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT
}
