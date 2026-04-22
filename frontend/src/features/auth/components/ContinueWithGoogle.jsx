import React from 'react'

/**
 * Google OAuth authentication button component
 * Provides a styled button that redirects users to Google OAuth login flow
 * 
 * OAUTH REDIRECT URLs:
 * - LOCAL: http://localhost:5000/api/auth/google
 * - PRODUCTION: https://maty-shop.onrender.com/api/auth/google
 * 
 * @component
 * @returns {JSX.Element} A styled anchor element linking to Google OAuth endpoint
 */
function ContinueWithGoogle() {
    // Get API base URL from environment variable (defaults to localhost)
    //! this is for render const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://maty-shop.onrender.com';
    // const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const apiBaseUrl = 'http://localhost:3000';

    // Construct Google OAuth redirect URL
    // LOCAL: http://localhost:5000/api/auth/google
    // PRODUCTION: https://maty-shop.onrender.com/api/auth/google
    const googleAuthUrl = `${apiBaseUrl}/api/auth/google`;

    return (
        <>
            <a
                href={googleAuthUrl}
                className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto mt-4
    border border-gray-300 rounded-lg px-4 py-2 
    bg-white text-gray-700 font-medium 
    shadow-sm hover:bg-gray-100 transition"
            >
                <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                />
                Continue with Google
            </a>
        </>
    )
}

export default ContinueWithGoogle
