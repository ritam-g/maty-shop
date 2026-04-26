# Quick Testing & Debugging Guide

## 1. Quick Setup (5 minutes)

### Backend
```bash
cd backend

# Create .env if not exists
echo "REZOR_PAY_API_KEY=rzp_test_ShjhyRmrT6o4a5" >> .env
echo "REZOR_PAY_API_SECRET=your_test_secret_here" >> .env

# Start server
npm start
```

### Frontend
```bash
cd frontend

# Create .env.local if not exists
echo "VITE_RAZORPAY_KEY_ID=rzp_test_ShjhyRmrT6o4a5" >> .env.local

# Start dev server
npm run dev
```

---

## 2. Payment Flow Testing

### Test Case 1: Successful INR Payment ✅

**Steps:**
1. Add items to cart
2. Click "Checkout"
3. Observe console logs:
   ```
   [Checkout] Starting payment process - Amount: 500 Currency: INR
   [API] Creating payment order - Amount: 500 INR
   [Checkout] Order created successfully - ID: order_ABC123XYZ
   ```

4. Razorpay modal should open
5. Use test card: `4111 1111 1111 1111`
6. OTP: `000000` (any 6 digits except `000000` will fail)
7. See success message

**Expected Response:**
```javascript
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_ABC123XYZ",
    "amount": 50000,      // 500 * 100 in paise
    "currency": "INR",
    "status": "created"
  }
}
```

### Test Case 2: Currency Normalization ✅

**Test with lowercase currency:**
```
Amount: 100
Currency: "inr"  (lowercase)
Expected: Normalized to "INR" ✅
```

**Test with mixed case:**
```
Amount: 50
Currency: "UsD"  (mixed case)
Expected: Normalized to "USD" ✅
```

### Test Case 3: Error - Invalid Amount ❌

**Test with negative amount:**
```
Amount: -50
Expected Error: "Amount must be a positive number greater than 0"
Toast Message: Error notification shown
```

**Test with zero:**
```
Amount: 0
Expected Error: "Amount must be a positive number greater than 0"
```

**Test with non-numeric:**
```
Amount: "abc"
Expected Error: "Amount must be a positive number greater than 0"
```

### Test Case 4: Error - Unsupported Currency ❌

**Test with unsupported currency:**
```
Amount: 500
Currency: "EUR"
Expected Error: "Unsupported currency: EUR. Supported: INR, USD"
```

### Test Case 5: Payment Cancellation ❌

**Steps:**
1. Open Razorpay checkout
2. Close the modal without completing payment
3. See error toast: "Payment cancelled. Please try again."
4. Console should show: `[Checkout] Payment modal dismissed by user`

### Test Case 6: Payment Failure ❌

**Steps:**
1. Open Razorpay checkout
2. Enter test card: `4111 1111 1111 1111`
3. Enter wrong OTP: `123456` (anything other than `000000`)
4. Payment should fail
5. See error: "Payment failed: [error description]"

---

## 3. Console Log Monitoring

### Open Browser DevTools (F12)

#### Check Backend Logs
```bash
Terminal where backend is running:

[Payment Service] Creating Razorpay order - Amount: 500 INR, Smallest Unit: 50000
[Payment Service] Order created successfully - Order ID: order_ABC123XYZ
[Order Controller] Creating order for user: 507f1f77bcf86cd799439011, Amount: 500, Currency: INR
[Order Controller] Order created - ID: order_ABC123XYZ
```

#### Check Frontend Logs
```javascript
Console in DevTools (F12 → Console):

[API] Creating payment order - Amount: 500 INR
[API] Order created - ID: order_ABC123XYZ
[Checkout] Starting payment process - Amount: 500 Currency: INR
[Checkout] Order created successfully - ID: order_ABC123XYZ
[Checkout] Razorpay options: {...}
```

---

## 4. Network Inspection

### Check API Request (F12 → Network)

**Request:**
```
POST http://localhost:5000/api/cart/payment/create/order

Body:
{
  "amount": 500,
  "currency": "INR"
}

Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_ABC123XYZ",
    "amount": 50000,
    "currency": "INR",
    "status": "created"
  }
}
```

---

## 5. Razorpay Modal Inspection

### Check if Modal Opens Correctly

**F12 → Elements → Find:**
```html
<div class="razorpay-checkout-modal">
  <!-- Modal content -->
</div>
```

### Razorpay Options Validation

In Console, check if Razorpay received correct options:
```javascript
// Should see:
{
  key: "rzp_test_ShjhyRmrT6o4a5",
  amount: 50000,           // ✅ In paise
  currency: "INR",
  order_id: "order_ABC123XYZ",  // ✅ NOT hardcoded
  name: "Your Store Name",
  description: "Order #order_ABC123XYZ"
}
```

---

## 6. Debugging Steps

### Issue: "Something went wrong" Error

**Step 1: Check order_id**
```javascript
// Open console and verify:
console.log(order.id)  // Should be "order_ABC123XYZ", NOT "order_9A33XWu170gUtm"
```

**Step 2: Check API response**
```javascript
// In Network tab, verify:
{
  "order": {
    "id": "order_ABC123XYZ",  // ✅ Present
    "amount": 50000,           // ✅ Present
    "currency": "INR"          // ✅ Present
  }
}
```

**Step 3: Check Razorpay key**
```javascript
// Verify in options:
key: import.meta.env.VITE_RAZORPAY_KEY_ID  // Should be rzp_test_...
```

### Issue: CORS Error

**Backend CORS config:**
```javascript
// Check if backend has this in app.js:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: 401 Unauthorized

**Check if user is authenticated:**
```javascript
// In Network tab, verify Authorization header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Issue: 400 Bad Request

**Verify request body:**
```javascript
// In Network tab:
{
  "amount": 500,           // ✅ Must be number
  "currency": "INR"        // ✅ Must be string
}
```

---

## 7. Razorpay Test Credentials

### Test Card (Always Works)
```
Card Number:  4111 1111 1111 1111
CVV:          123
Expiry:       12/28
OTP:          000000 (successful)
```

### Failed Payment (Test)
```
Use any OTP except: 000000
Example: 123456
Result: Payment fails (for testing error handling)
```

---

## 8. Quick Checklist

Run through these before assuming it's broken:

- [ ] `npm start` running in backend
- [ ] `npm run dev` running in frontend
- [ ] `.env` file exists in backend with Razorpay keys
- [ ] `.env.local` file exists in frontend with RAZORPAY_KEY_ID
- [ ] Check backend logs for "Order created successfully"
- [ ] Check frontend console for "Order created - ID:"
- [ ] Verify order.id is NOT "order_9A33XWu170gUtm"
- [ ] Razorpay modal appears without error
- [ ] Test card works in Razorpay

---

## 9. Common Issues & Quick Fixes

| Issue | Cause | Check |
|-------|-------|-------|
| "Invalid order_id" | Hardcoded ID | Verify `order.id` in console |
| "Something went wrong" | Wrong/missing order_id | Check network response |
| CORS error | Frontend/backend URL mismatch | Verify `http://localhost:PORT` |
| 401 error | Not authenticated | Check JWT token in headers |
| Amount wrong in Razorpay | Not converted to paise | Verify `amount * 100` in logs |
| Currency not recognized | Typo in currency | Check console for "Unsupported currency" |
| Modal won't open | Missing key or order_id | Check options in console |
| Payment fails immediately | Test card wrong | Use `4111 1111 1111 1111` |

---

## 10. Production Testing Checklist

Before deploying to production:

- [ ] Switch to Live Razorpay keys
- [ ] Test with live keys on localhost
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Update frontend API base URL to production backend
- [ ] Test payment flow end-to-end on production
- [ ] Test error cases on production
- [ ] Monitor console logs in production
- [ ] Set up payment verification webhook
- [ ] Test payment cancellation flow

---

## Need Help?

**Check these files first:**
1. `RAZORPAY_SETUP.md` - Environment setup
2. `RAZORPAY_FIX_EXPLANATION.md` - Detailed explanation of changes
3. Backend logs - Check for validation errors
4. Frontend console - Check for API/Razorpay errors
5. Network tab - Check request/response structure

**Common Razorpay Docs:**
- [Razorpay Orders API](https://razorpay.com/docs/orders/)
- [Razorpay Checkout Modal](https://razorpay.com/docs/checkout/hosted/)
- [Test Cards](https://razorpay.com/docs/development/test-cards/)
