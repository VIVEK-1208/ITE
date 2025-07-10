// server/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { db } = require("../firebaseAdmin");

// POST /api/products - Add a new product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      type,
      weight,
      image,
      quantity,
      keywords,
    } = req.body;

    if (!name || !price || !type) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const id = uuidv4();
    const newProduct = {
      id,
      name,
      price,
      description: description || "",
      brand: brand || "",
      type,
      weight: weight || 1,
      image: image || "/img/default.jpg",
      quantity: quantity || 1,
      keywords: Array.isArray(keywords) ? keywords : [],
      createdAt: new Date().toISOString(),
    };

    await db.collection("products").doc(id).set(newProduct);

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products - Fetch all products
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
