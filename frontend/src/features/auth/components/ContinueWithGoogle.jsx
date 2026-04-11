import React from 'react'

function ContinueWithGoogle() {
    return (
        <>
            <a
                href="/api/auth/google"
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
