const express = require("express");
const Dish = require("../models/dish");

const router = express.Router();

// GET all dishes
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    console.error("Error fetching dishes:", err.message);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
});

module.exports = router;
