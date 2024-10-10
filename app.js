import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import mongoose from "mongoose";
import { DATABASE, MAX_JSON_SIZE, PORT, REQUEST_NUMBER, REQUEST_TIME, URL_ENCODE, WEB_CACHE } from "./app/config/config.js";
import router from "./routes/api.js";

const app = express();

// App Use Default Middleware
app.use(cors());
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODE }));
app.use(helmet());

// App Use Limiter
const limiter = rateLimit({ windowMs: REQUEST_TIME, max: REQUEST_NUMBER });
app.use(limiter);

// Cache
app.set('etag', WEB_CACHE);

// Database Connect
mongoose.connect(DATABASE, { autoIndex: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB disconnected", err);
    });

// API Routes
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "fail", message: "An internal server error occurred" });
});

app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));



// Start the server
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
