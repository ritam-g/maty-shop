# ⚡ QUICK START - Run on Localhost

## 🚀 Start Backend (Port 5000)

```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
✅ Server is running on port 5000
📡 Environment: development
🌐 Frontend should connect to: http://localhost:5000
```

---

## 🎨 Start Frontend (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## 🌐 Open Browser

Navigate to: **http://localhost:5173**

---

## ✅ Verify Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login/register
4. Check requests go to `http://localhost:5000`

---

## 🔧 Configuration Files

- **Backend Config**: `backend/.env` - Set `PORT=5000`, `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback`
- **Frontend Config**: `frontend/.env.local` - Leave empty or blank (defaults to localhost:5000)

---

## 📚 Full Documentation

- See **LOCALHOST_SETUP_GUIDE.md** for detailed setup
- See **SETUP_CHANGES.md** for what was modified
- See **backend/.env.example** for backend configuration
- See **frontend/.env.example** for frontend configuration

---

## 🔑 Key URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Auth | http://localhost:5000/api/auth |
| Google OAuth | http://localhost:5000/api/auth/google |
| Cart API | http://localhost:5000/api/cart |
| Product API | http://localhost:5000/api/product |

---

## ❓ Troubleshooting

**CORS Error?**
- Make sure backend is running on `http://localhost:5000`
- Check frontend is on `http://localhost:5173`

**Cannot Connect to Backend?**
- Verify backend port 5000 is not in use
- Check MongoDB is running/connected
- Check `.env` file has `MONGO_URL`

**Google OAuth Not Working?**
- Verify `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback` in backend `.env`

---

## 📝 Notes

- Backend defaults to port 5000 (changed from 3000)
- Frontend defaults to connecting to `http://localhost:5000`
- All URL changes are commented in the code
- No code modifications needed to switch between LOCAL/PRODUCTION
- To use Render production: Set `VITE_API_BASE_URL=https://maty-shop.onrender.com` in frontend/.env.local
