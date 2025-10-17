import fs from "fs";
import csv from "csv-parser";
import Product from "../models/product.js";
import { Op } from "sequelize";
const REQUIRED_FIELDS = ["sku", "name", "brand", "mrp", "price"];
function validateRow(row) {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (!row[field] || String(row[field]).trim() === "") {
      errors.push(`Missing ${field}`);
    }
  }

  const mrp = parseFloat(row.mrp);
  const price = parseFloat(row.price);
  const quantity =
    row.quantity === undefined || row.quantity === ""
      ? 0
      : parseInt(row.quantity, 10);

  if (!Number.isNaN(mrp) && !Number.isNaN(price) && price > mrp) {
    errors.push("price > mrp");
  }
  if (!Number.isNaN(quantity) && quantity < 0) {
    errors.push("negative quantity");
  }

  return {
    errors,
    parsed: { mrp, price, quantity: Number.isNaN(quantity) ? 0 : quantity },
  };
}

export const uploadCSV = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const validRows = [];
  const failedRows = [];
  fs.createReadStream(file.path)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
    .on("data", (row) => {
      if (
        Object.values(row).every(
          (v) => v === undefined || v === null || String(v).trim() === ""
        )
      ) {
        return;
      }
      for (const key in row) {
        row[key] = row[key] ? String(row[key]).trim() : row[key];
      }
      const { errors, parsed } = validateRow(row);
      if (errors.length) {
        failedRows.push({ sku: row.sku || null, errors });
      } else {
        validRows.push({
          sku: row.sku,
          name: row.name,
          brand: row.brand,
          color: row.color || null,
          size: row.size || null,
          mrp: parsed.mrp,
          price: parsed.price,
          quantity: parsed.quantity,
        });
      }
    })
    .on("end", async () => {
      try {
        let stored = 0;
        for (const p of validRows) {
          await Product.upsert(p);
          stored++;
        }
        fs.unlink(file.path, (err) => {
          if (err) console.warn("Failed to delete temp file:", err.message);
        });
        return res.json({ stored, failed: failedRows });
      } catch (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ error: "DB error", details: err.message });
      }
    })
    .on("error", (err) => {
      console.error("CSV parse error:", err);
      return res
        .status(400)
        .json({ error: "Failed to parse CSV", details: err.message });
    });
};

export const listProducts = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
  const offset = (page - 1) * limit;
  try {
    const items = await Product.findAll({ offset, limit });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  const { brand, color, minPrice, maxPrice } = req.query;
  const where = {};
  if (brand) where.brand = brand;
  if (color) where.color = color;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice !== undefined) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice !== undefined) where.price[Op.lte] = parseFloat(maxPrice);
  }
  try {
    const results = await Product.findAll({ where });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
