import express from "express";
import sequelize from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import Product from "./models/product.js"; // ensure model is imported so Sequelize registers it

const app = express();
app.use(express.json());

// routes
app.use("/", productRoutes);

// start
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await sequelize.sync(); // creates tables if not exist
    console.log("✅ Database synced");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
