import dotenv from 'dotenv';
dotenv.config();
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

import { authenticate } from '../src/middleware/auth.middleware.js';
import userRouter from '../src/routes/user.routes.js';
import stockRouter from '../src/routes/stock.routes.js';
import invoiceRouter from '../src/routes/invoice.routes.js';
import profileRouter from '../src/routes/profile.routes.js';

app.use("/api/v1/user", userRouter);
app.use("/api/v1/stock", authenticate, stockRouter);
app.use("/api/v1/invoice", authenticate, invoiceRouter);
app.use("/api/v1/profile", authenticate, profileRouter);