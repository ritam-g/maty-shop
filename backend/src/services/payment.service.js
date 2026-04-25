import Razorpay from 'razorpay'
import { AppConfig } from '../config/config.js';


const razorpay = new Razorpay({
    key_id: AppConfig.REZOR_PAY_API_KEY,
    key_secret: AppConfig.REZOR_PAY_API_SECRET,
});

// now her will be funciton of the creating order 

export async function createOrder({ amount, currency }) {
    
    const option = {
        amount: amount * 100,
        currency:currency.toUpperCase(),
    }

    const order = await razorpay.orders.create(option)
    return order
}