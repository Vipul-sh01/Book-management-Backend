import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiError } from './utils/ApiError.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
}));

app.use(express.json({limit: "18kb"}));
app.use(express.urlencoded({limit: "18kb", extends: true}));
app.use(express.static("public"));
app.use(cookieParser());

import bookRouters from './routers/books.router.js';
app.use("/api/v1/books", bookRouters);

import browserBook from './routers/browser.routs.js';
app.use("/api/v1/books", browserBook);




app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJson());
    }
    console.error(err.stack); 
    return res.status(500).json({ message: "Internal Server Error" });
});

export {app};
