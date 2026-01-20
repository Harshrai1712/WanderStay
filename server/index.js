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

// ✅ Then the rest
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(PATH_TO_UPLOADS));

// CORS for localhost only
app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true   
}))

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB", error));

app.use("/", router);
app.use(errorMiddleware);

// ✅ Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: { message: err.message || "Internal server error." },
    });
});

app.listen(5001, () => console.log("Server is listening on port 5001..."));
