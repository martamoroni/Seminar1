const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const dishesRoutes = require("./routes/dishesRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Mount dishes API routes
app.use("/api/dishes", dishesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web app on http://localhost:${PORT}`));
