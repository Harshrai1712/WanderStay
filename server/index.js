require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorMiddleware = require("./src/middleware/errorHandling");

const router = require("./src/routes/places");
const { default: mongoose } = require("mongoose");

const PATH_TO_UPLOADS = path.join(__dirname, "/assets/uploads");

const app = express();
const port = process.env.PORT || 4000;



app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(PATH_TO_UPLOADS));

// =================================================================
// === THIS IS THE SECTION THAT HAS BEEN UPDATED ===
// It now allows both your local machine and your deployed frontend
app.use(cors({
    origin: [
        'http://127.0.0.1:5173', 
        'https://wanderstay-frontend-l8f6.onrender.com' // Your frontend URL
    ],
    credentials: true
}));
// =================================================================

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });

// Your routes
app.use("/", router);

// Your custom error handler middleware
app.use(errorMiddleware);

// Fallback error handler for any other errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || "Internal server error.",
        },
    });
});

app.listen(5001, () => console.log("Server is listening on port 5001..."));