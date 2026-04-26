# Local Development vs Production Setup Guide

## Overview
Your E-Commerce app now supports both **local development (localhost)** and **production (Render)** configurations. Choose the setup that matches your needs.

---

## 🚀 OPTION 1: Run Everything on Localhost (Local Development)

### Prerequisites
- Node.js installed
- MongoDB running locally (or connection string in `.env`)
- Backend port available: `5000`
- Frontend port available: `5173` (Vite default)

### Backend Setup (Localhost)

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file in backend directory:
   ```
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   NODE_ENV=development
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start backend server:
   ```bash
   npm start
   # or
   node server.js
   # Backend will run on: http://localhost:5000
   ```

### Frontend Setup (Localhost)

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Create `.env.local` file in frontend directory:
   ```
   # OPTION 1: Leave empty or comment out - defaults to localhost:5000
   # VITE_API_BASE_URL=http://localhost:5000

   # OR simply create empty file - frontend defaults to localhost
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start frontend development server:
   ```bash
   npm run dev
   # Frontend will run on: http://localhost:5173
   ```

5. Open browser and navigate to:
   ```
   http://localhost:5173
   ```

### ✅ Backend CORS Configuration for Localhost
The backend already allows these localhost URLs:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternative)
- `http://localhost:3000` (Common dev port)

No additional CORS configuration needed!

---

## 🌐 OPTION 2: Frontend Localhost + Backend on Render

### When to Use
- You want to develop frontend locally but test against production backend
- You want to verify frontend works with production API before deploying

### Frontend Setup

1. Create `.env.local` in frontend directory:
   ```
   VITE_API_BASE_URL=https://maty-shop.onrender.com
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm install  # if not already done
   npm run dev
   ```

3. Open browser: `http://localhost:5173`

### ⚠️ Important Notes for This Option
- Your production backend must be running on Render
- CORS is configured to allow requests from Render
- Make sure you're testing against a stable production build
- Don't make database changes unless intended

---

## 🔧 Configuration Details

### URL Routing
All API services automatically construct URLs:
```
${API_BASE_URL}/api/{endpoint}
```

**Examples:**
- LOCAL: `http://localhost:5000/api/auth/login`
- PRODUCTION: `https://maty-shop.onrender.com/api/auth/login`

### Files Modified for Localhost Support

**Backend:**
- `backend/src/app.js` - CORS allows localhost + Render URLs
- Google OAuth callback URL supports both environments

**Frontend:**
- `frontend/src/features/auth/services/authApi.service.js` - Uses `VITE_API_BASE_URL`
- `frontend/src/features/cart/services/api.service.js` - Uses `VITE_API_BASE_URL`
- `frontend/src/features/product/services/product.api.js` - Uses `VITE_API_BASE_URL`
- `frontend/.env.example` - Updated with configuration instructions

### Default Behavior
- **Frontend**: If `VITE_API_BASE_URL` is not set → defaults to `http://localhost:5000`
- **Backend**: Allows requests from localhost without special configuration

---

## 🚨 Troubleshooting

### Problem: "CORS error" on localhost
**Solution:**
- Make sure backend is running on `http://localhost:5000`
- Check backend CORS configuration in `backend/src/app.js`
- Verify frontend is accessing from `http://localhost:5173`, `5174`, or `3000`

### Problem: Frontend connects to Render but you want localhost
**Solution:**
- Delete or clear `VITE_API_BASE_URL` from `.env.local`
- Frontend will default to `http://localhost:5000`
- Restart frontend dev server

### Problem: "Cannot GET /api/auth/google/callback"
**Solution:**
- For localhost: Make sure `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback` in backend `.env`
- For Render: Make sure `GOOGLE_CALLBACK_URL=https://maty-shop.onrender.com/api/auth/google/callback` in backend `.env`

### Problem: MongoDB connection failed
**Solution:**
- Verify `MONGO_URL` in backend `.env` is correct
- If using local MongoDB, make sure it's running (`mongod`)
- Check network access if using cloud MongoDB (e.g., MongoDB Atlas)

---

## 📝 Quick Reference

| Aspect | Local (Localhost) | Production (Render) |
|--------|------------------|------------------|
| Backend URL | `http://localhost:5000` | `https://maty-shop.onrender.com` |
| Frontend URL | `http://localhost:5173` | Frontend hosted on Render |
| Frontend Env Var | Not set or empty | `VITE_API_BASE_URL=https://maty-shop.onrender.com` |
| Google OAuth Callback | `http://localhost:5000/api/auth/google/callback` | `https://maty-shop.onrender.com/api/auth/google/callback` |
| Database | Local or MongoDB Atlas | MongoDB Atlas (production) |
| Node Env | `development` | `production` |

---

## 🎯 Step-by-Step Quick Start (Localhost)

```bash
# Terminal 1: Backend
cd backend
# Create .env file with your credentials
npm install
npm start
# Wait for: "Server running on port 5000"

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# Wait for: "Local: http://localhost:5173"

# Open browser
http://localhost:5173
```

That's it! 🎉

---

## 📞 Need Help?

All URL configurations are commented in the code:
- Search for "LOCAL:" and "PRODUCTION:" comments in source files
- Check `.env.example` for configuration templates
- Review this guide for detailed explanations
