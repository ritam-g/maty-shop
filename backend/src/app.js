import express from 'express';
import cokkieParser from 'cookie-parser'
import cors from 'cors'
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import authRouter from './routes/auth.route.js';
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { AppConfig } from './config/config.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cokkieParser());
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: AppConfig.CLIENT_ID,
    clientSecret: AppConfig.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    return done(null, profile)
}))
// !now need to add cors policy
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }))
// rote

app.use('/api/auth', authRouter)


app.use(globalErrorHandler);

export default app;
