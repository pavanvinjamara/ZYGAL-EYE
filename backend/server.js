const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const { connectDB, closeDB } = require("./src/config/db");
const vendorRepo = require("./src/repositories/vendor.repository");
const userRepo = require("./src/repositories/user.repository");
const refreshTokenRepo = require("./src/repositories/refreshToken.repository");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Vendor Portal API Running" });
});

app.use("/api/v1", require("./src/routes/index"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — catches every next(err) from controllers
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
});

async function startServer() {
  try {
    await connectDB();

    // Set up collections + indexes for everything auth touches
    await vendorRepo.ensureIndexes();
    await userRepo.ensureIndexes();
    await refreshTokenRepo.ensureIndexes();

    const server = app.listen(PORT, () => {
      console.log("====================================");
      console.log("🚀 Vendor Portal API Started");
      console.log(`🌐 Port : ${PORT}`);
      console.log("====================================");
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received — shutting down gracefully");
      server.close();
      await closeDB();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
}

startServer();