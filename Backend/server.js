require("dotenv").config(); // ✅ Load .env variables at the top

const express = require("express");
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const multer = require("multer");
const path = require("path"); 

const app = express();
const PORT = process.env.PORT || 5001; 
const CONNECTION_STRING = process.env.CONNECTION_STRING; // ✅ Read DB URL from .env

// Ensure environment variables are loaded
if (!CONNECTION_STRING) {
    console.error("Missing CONNECTION_STRING in .env file");
    process.exit(1);
}

// Connect to Database
connectDb(CONNECTION_STRING)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
});

// Middleware
app.use(cors({
    origin: ["http://localhost:5000","http://localhost:5174","http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true 
}));// Allow frontend
app.use(express.json({ limit: "50mb" })); // Increase JSON limit
app.use(express.urlencoded({ extended: true  ,limit: "50mb" })); // Increase URL-encoded limit

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use("/",require("./routes/user"))
app.use("/recipe", require("./routes/recipe"));

// Start Server
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);
