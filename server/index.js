import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/db/db.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cron from 'node-cron';
import axios from 'axios';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

import userRouter from './src/routes/user.routes.js';
import stockRouter from './src/routes/stock.routes.js';
import invoiceRouter from './src/routes/invoice.routes.js';
import profileRouter from './src/routes/profile.routes.js';
import { authenticate } from './src/middleware/auth.middleware.js';

app.use("/api/v1/user", userRouter);
app.use("/api/v1/stock", authenticate, stockRouter);
app.use("/api/v1/invoice", authenticate, invoiceRouter);
app.use("/api/v1/profile", authenticate, profileRouter);

// Google OAuth routes
import { googleAuth, googleAuthCallback, googleAuthSuccess } from './src/controllers/user.controller.js';

app.get("/auth/google", googleAuth);
app.get("/auth/google/callback", googleAuthCallback, googleAuthSuccess);

app.get("/", (req, res) => {
    res.send("API WORKING");
})

cron.schedule('*/10 * * * *', () => {
    axios.get(process.env.BACKEND_URL)
        .then(() => console.log('✅ Pinged self to stay awake'))
        .catch(err => console.error('❌ Ping failed:', err.message));
});

connectDB()
    .then(() => {
        app.listen(4444, () => {
            console.log("App running on port 4444");
        });
    })
    .catch((err) => {
        console.log(err);
    });
