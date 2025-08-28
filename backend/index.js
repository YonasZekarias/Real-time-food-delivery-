require("dotenv").config();
const express = require("express");
// fixed routes
const authRoutes = require("./routes/auth.Routes");
const restaurantRoutes = require("./routes/restaurant.route");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const cors = require("cors");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Connect to MongoDB and Redis
Promise.all([connectDB(),
  connectRedis()
]).catch((err) => {
  logger.error(`Startup error: ${err.message}`);
  if (process.env.NODE_ENV !== "test")
    return process.exit(1); // Exit process with failure
  else throw err; // Rethrow error in test environment
});

// API Routes
app.use("/api/delivery/auth", authRoutes);
app.use("/api/delivery/admin", adminRoutes);
app.use("/api/delivery/customer", cartRoutes);

app.use("/api/delivery/restaurants", restaurantRoutes);

app.use("/api/delivery/orders", orderRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
