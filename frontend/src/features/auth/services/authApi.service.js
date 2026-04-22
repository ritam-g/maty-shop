import axios from "axios";

/**
 * Base URL for authentication API endpoints
 * 
 * DEVELOPMENT (Localhost):
 * Uses http://localhost:5000/api/auth for local backend
 * 
 * PRODUCTION (Render):
 * Uses https://maty-shop.onrender.com/api/auth for hosted backend
 * 
 * Configuration: Set VITE_API_BASE_URL in .env.local for production/Render URL
 * Example: VITE_API_BASE_URL=https://maty-shop.onrender.com
 */
//! render const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://maty-shop.onrender.com';
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const apiBaseUrl = 'http://localhost:3000';

const authApi = axios.create({
    // LOCAL: http://localhost:5000/api/auth
    // PRODUCTION: https://maty-shop.onrender.com/api/auth (set via VITE_API_BASE_URL)
    baseURL: `${apiBaseUrl}/api/auth`,
    withCredentials: true
})


/**
 * Registers a new user
 * 
 * @param {Object} userData - The user registration data
 * @param {string} userData.name - The user's full name
 * @param {string} userData.email - The user's email address
 * @param {string} userData.password - The user's password
 * @param {string} userData.role - The user's role (buyer or seller)
 * @param {string} userData.contact - The user's contact number
 * @returns {Promise<Object>} The registration response data including user and token
 */
export async function register({ name, email, password, role, contact }) {
    const response = await authApi.post('/register', { name, email, password, role, contact });
    return response.data
}

/**
 * Logs in an existing user
 * 
 * @param {Object} credentials - The user's login credentials
 * @param {string} credentials.email - The user's email address
 * @param {string} credentials.password - The user's password
 * @returns {Promise<Object>} The login response data including user and token
 */
export async function login({ email, password }) {
    const response = await authApi.post('/login', { email, password });
    return response.data
}

/**
 * Retrieves the current authenticated user's information
 * 
 * @returns {Promise<Object>} The current user's data
 */
export async function getMe() {
    const response = await authApi.get('/me');
    return response.data
}
