import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: 'auto'
     },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(userRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
