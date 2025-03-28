import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/db/db.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))
app.use(cookieParser());

import userRouter from './src/routes/user.routes.js';
import stockRouter from './src/routes/stock.routes.js';
import invoiceRouter from './src/routes/invoice.routes.js';
import profileRouter from './src/routes/profile.routes.js';
import { authenticate } from './src/middleware/auth.middleware.js';

app.use("/api/v1/user", userRouter);
app.use("/api/v1/profile", authenticate, profileRouter);
app.use("/api/v1/stock", authenticate, stockRouter);
app.use("/api/v1/invoice", authenticate, invoiceRouter);

connectDB()
    .then(() => {
        app.listen(4444, async (req, res) => {
            console.log("app running on port 4444");            
        })
    })
    .catch((err) => {
        console.log(err);
    })