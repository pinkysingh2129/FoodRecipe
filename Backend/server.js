require("dotenv").config(); // ✅ Load .env variables first

const express = require("express");
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

// Ensure environment variables exist
if (!CONNECTION_STRING) {
  console.error("❌ Missing CONNECTION_STRING in .env file");
  process.exit(1);
}

// Connect to Database
connectDb(CONNECTION_STRING)
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: [
    "https://food-recipe-beige.vercel.app",
    "https://food-recipe-o57c-seven.vercel.app",
    "http://localhost:5174",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/", require("./routes/user"));     // User routes
app.use("/recipe", require("./routes/recipe")); // Recipe routes

// Test route
app.get("/", (req, res) => {
  res.send("✅ Server is running fine");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
