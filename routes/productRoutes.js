import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as controller from "../controllers/productController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.join(__dirname, "..", "uploads"),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), controller.uploadCSV);
router.get("/products", controller.listProducts);
router.get("/products/search", controller.searchProducts);
export default router;
