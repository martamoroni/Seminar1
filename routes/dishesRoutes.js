const express = require("express");
const Dish = require("../models/dish");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    console.error("Error fetching dishes:", err.message);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const dishName = req.params.name;
    const dish = await Dish.findOne({ name: dishName });

    if (!dish) {
      return res.status(404).json({ error: "Dish was not found" });
    }

    res.json(dish);
  } catch (err) {
    console.error("Error fetching dish by name:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      ingredients,
      preparationSteps,
      cookingTime,
      origin,
      difficulty,
    } = req.body;

    const doesDishExist = await Dish.findOne({ name }); // null or the dish
    if (doesDishExist) {
      return res.status(409).json({ error: "Dish already exists" });
    }

    const newDish = new Dish({
      name,
      ingredients,
      preparationSteps,
      cookingTime,
      origin,
      difficulty,
    });

    await newDish.save();
    res.status(201).json(newDish);
  } catch (err) {
    console.error("Error fetching dish by name:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const {
    name,
    ingredients,
    preparationSteps,
    cookingTime,
    origin,
    difficulty,
  } = req.body;

  if (
    !name ||
    !ingredients ||
    !preparationSteps ||
    !cookingTime ||
    !origin ||
    !difficulty
  ) {
    return res
      .status(400)
      .json({ error: "All fields required for full update" });
  }

  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedDish) {
      return res
        .status(404)
        .json({ error: "Dish was not found, check the id" });
    }

    res.json(updatedDish);
  } catch (err) {
    console.error("Error updating dish:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const dishToDelete = await Dish.findByIdAndDelete(req.params.id);

    if (!dishToDelete) {
      return res
        .status(404)
        .json({ error: "Dish was not found, check the id" });
    }

    res
      .status(200)
      .json({ message: "Dish was deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("Error deleting dish:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
