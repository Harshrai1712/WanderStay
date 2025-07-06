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

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(PATH_TO_UPLOADS));

// CORS for localhost only
app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            if (
                !origin ||
                origin.startsWith("http://127.0.0.1:") ||
                origin.startsWith("http://localhost:")
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        }
    })
);

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
