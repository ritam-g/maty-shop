# Razorpay Integration Setup Guide

## 1. Backend Environment Setup

### Create `.env` file in `backend/` directory:

```env
# Database
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Razorpay (Test Keys - from https://dashboard.razorpay.com/app/keys)
REZOR_PAY_API_KEY=rzp_test_YOUR_TEST_KEY_ID
REZOR_PAY_API_SECRET=rzp_test_YOUR_TEST_KEY_SECRET

# Server Port
PORT=5000
```

### Get Razorpay Test Keys:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or login
3. Navigate to **Settings → API Keys**
4. Copy **Key ID** (starts with `rzp_test_`)
5. Copy **Key Secret** (secret key)
6. Toggle **Test Mode** ON to ensure you're using test keys

## 2. Frontend Environment Setup

### Create `.env.local` file in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
```

**Note:** The `VITE_RAZORPAY_KEY_ID` should match your backend test key.

## 3. Verify Setup

### Check Backend
```bash
cd backend
npm start
# Console should show: "[Payment Service] Creating order..." logs
```

### Check Frontend
```bash
cd frontend
npm run dev
# Visit http://localhost:5173 (or your Vite port)
```

## 4. Testing Payment Flow

### Test Scenario 1: INR Payment (Default)
```bash
# Amount: 500 (5 rupees)
# Currency: INR
# Expected: Order created in paise (50000)
```

### Test Scenario 2: USD Payment
```bash
# Amount: 29.99 (29.99 dollars)
# Currency: USD
# Expected: Order created in cents (2999)
```

### Test Scenario 3: Error Case - Invalid Amount
```bash
# Amount: -50 or 0
# Expected: 400 error with message "Amount must be a positive number greater than 0"
```

### Test Scenario 4: Error Case - Unsupported Currency
```bash
# Currency: EUR
# Expected: 400 error with message "Unsupported currency: EUR"
```

## 5. Razorpay Test Payment Methods

### Card Details (for testing):
- **Card Number:** `4111 1111 1111 1111`
- **CVV:** `123`
- **Expiry:** Any future date (e.g., `12/28`)
- **OTP:** `000000`

### Use Cases:
- Enter correct OTP to **simulate successful payment**
- Enter wrong OTP to **simulate failed payment**

## 6. Console Logs for Debugging

### Backend Logs
```
[Payment Service] Creating Razorpay order - Amount: 500 INR, Smallest Unit: 50000
[Payment Service] Order created successfully - Order ID: order_ABC123XYZ
[Order Controller] Order created - ID: order_ABC123XYZ
```

### Frontend Logs
```
[API] Creating payment order - Amount: 500 INR
[API] Order created - ID: order_ABC123XYZ
[Checkout] Starting payment process - Amount: 500 Currency: INR
[Checkout] Order created successfully - ID: order_ABC123XYZ
[Checkout] Razorpay options: {...}
[Checkout] Payment successful - Response: {...}
```

## 7. Troubleshooting

### Issue: "Something went wrong" on Razorpay Modal

**Cause:** Invalid `order_id` or missing `key`

**Solution:**
```javascript
// ✅ CORRECT
order_id: order.id,        // From backend response
key: "rzp_test_...",       // From environment

// ❌ WRONG
order_id: "hardcoded_id",  // Causes error
key: undefined,            // Causes error
```

### Issue: Amount showing incorrectly

**Cause:** Amount not converted to paise/cents

**Solution:**
```javascript
// Backend: Convert to paise
amount: 500 → amount * 100 = 50000 (paise)

// Frontend: Use already-converted amount from backend
amount: order.amount  // Already in paise from backend
```

### Issue: CORS Error

**Cause:** Frontend and backend on different origins

**Solution:** Ensure backend CORS config includes:
```javascript
// In backend app.js
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true
}));
```

### Issue: Authentication Error

**Cause:** User not authenticated before payment

**Solution:** Ensure:
```javascript
// User must be logged in
// Token must be valid in request header
Authorization: Bearer YOUR_JWT_TOKEN
```

## 8. Production Deployment

### Switch to Live Keys:
1. Change test keys to live keys in `.env`
2. Update `VITE_RAZORPAY_KEY_ID` in frontend `.env`
3. Test with small amount first

### Generate Live Keys:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Toggle **Test Mode** OFF
3. Copy **Live Key ID** (starts with `rzp_live_`)
4. Copy **Live Key Secret**

## 9. Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| "Invalid order_id" | Hardcoded ID or missing order.id | Use `order.id` from backend |
| "Missing key" | No Razorpay key provided | Add VITE_RAZORPAY_KEY_ID to .env |
| "CORS error" | Frontend/backend origin mismatch | Configure CORS in backend |
| "Something went wrong" | Invalid amount, order_id, or currency | Check console logs |
| "Payment failed" | Wrong test card or expired OTP | Use correct test card details |

## 10. Next Steps

1. **Verify Payment on Backend:**
   Create endpoint to verify payment signature
   ```javascript
   POST /api/cart/payment/verify
   {
     "razorpay_order_id": "order_123",
     "razorpay_payment_id": "pay_123",
     "razorpay_signature": "signature_123"
   }
   ```

2. **Update Order Status:**
   Mark order as "paid" in database after verification

3. **Send Confirmation Email:**
   Send order confirmation to user

4. **Clear Cart:**
   Clear cart items after successful payment

---

## Debug Checklist

- [ ] Backend `.env` has correct Razorpay keys
- [ ] Frontend `.env.local` has correct Razorpay key ID
- [ ] Razorpay test mode is enabled
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Order created with correct amount in paise
- [ ] Order ID is not hardcoded
- [ ] User is authenticated before payment
- [ ] Console shows successful order creation logs
- [ ] Razorpay modal opens without error
