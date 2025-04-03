const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./api/routes/auth");
const musicRoutes = require("./api/routes/music");
const nftRoutes = require("./api/routes/nft");
const userRoutes = require("./api/routes/user");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080", // Replace with your frontend URL
    credentials: true, // Allow cookies or authentication tokens if needed
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/nft", nftRoutes);
app.use("/api/user", userRoutes);

// Error Handling
app.use(errorHandler);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed", err));

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
