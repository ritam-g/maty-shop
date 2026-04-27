<br/>

## 📖 Overview

**E-Commerce Platform** (formerly known as Maty Shop) is a full-stack MERN application built for seamless online shopping and inventory management. This modern e-commerce solution provides a premium, responsive user interface combined with a robust backend architecture to handle everything from authentication and product browsing to secure checkout and dashboard analytics.

---

## ✨ Key Features

- **🔐 Secure Authentication**: Dual authentication support with standard Email/Password (JWT + bcrypt) and seamless Google OAuth (via Passport.js).
- **🛍️ Comprehensive Product Management**: Dynamic product catalog with advanced search, filtering, and detailed preview components.
- **🛒 Shopping Cart & Checkout**: Persistent cart management optimized for performance, seamlessly integrated with **Razorpay** for secure payment processing.
- **📊 Analytics Dashboard**: Dedicated dashboard for sellers to monitor sales, revenue, and manage product inventory efficiently.
- **☁️ Cloud Image Storage**: Integrated with **ImageKit** and Multer for efficient and scalable product image uploads and delivery.
- **🎨 Premium UI/UX**: Sleek, modern interface built with React, Vite, **Tailwind CSS v4**, and beautifully animated using **Framer Motion**.
- **🚀 Production Ready**: Fully configured for deployment (e.g., Render) with trust proxies, rate limiting, and static file serving for the React frontend.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Payments**: React Razorpay

### Backend
- **Server**: Node.js, Express.js v5
- **Database**: MongoDB (Mongoose v9)
- **Authentication**: Passport.js (Google OAuth 2.0), JSON Web Tokens (JWT)
- **File Uploads**: Multer, ImageKit
- **Payments**: Razorpay SDK
- **Security**: Helmet, Express Rate Limit, CORS

---

## 🚀 Quick Start Setup

Follow these steps to get the project running locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection URI
- Google OAuth Client ID & Secret
- Razorpay Account (Key ID & Secret)
- ImageKit Account Keys

### 1. Clone the repository
```bash
git clone <repository-url>
cd E-Commerce
```

### 2. Install Dependencies
You can install both frontend and backend dependencies using the root script:
```bash
npm run install:all
```

### 3. Environment Configuration

#### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
```

#### Frontend (`frontend/.env.local`)
Create a `.env.local` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Running the Application (Development)

To run both the frontend and backend servers simultaneously for development, open two terminal windows.

**Terminal 1 (Backend):**
```bash
npm run dev:backend
```

**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```

---

## 📂 Project Structure

```text
E-Commerce/
├── backend/
│   ├── public/             # Served React build files (in production)
│   ├── src/
│   │   ├── config/         # Environment variables & DB config
│   │   ├── controller/     # Route controllers
│   │   ├── middleware/     # Global error handling, Auth, Rate limiters
│   │   ├── model/          # Mongoose schemas (Cart, Payment, Product, User)
│   │   ├── routes/         # Express routes (Auth, Cart, Product)
│   │   ├── services/       # Core business logic (Payments, Uploads)
│   │   ├── utils/          # Helpers
│   │   ├── validator/      # Express validator schemas
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── features/       # Redux slices, components & APIs (Auth, Cart, Dashboard, Product)
│   │   ├── routes/         # React Router configurations
│   │   ├── App.jsx         # Main layout & context providers
│   │   └── main.jsx        # React DOM render
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json            # Root configuration for concurrent scripts
```

---

## 🌐 Production Deployment

This project is configured to be easily deployed on platforms like Render. The backend `app.js` is set up to serve the statically built React frontend from the `backend/public` folder.

To build the project for production:
```bash
npm run build
```
This script will build the Vite frontend, clean the `backend/public` directory, and move the newly compiled React assets over to the backend, ready to be served by Express. Start the production server with:
```bash
npm run start
```
