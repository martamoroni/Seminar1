const express = require("express");
const Dish = require("../models/dish");

const router = express.Router();

// GET all dishes
router.get("/", async (req, res) => {
  try {
    // Finds all dishes in the db
    const dishes = await Dish.find();

    // Response with the array of dishes
    res.json(dishes);
  } catch (err) {
    // Show error
    console.error("Error fetching dishes:", err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
});

// GET dish by name
router.get("/:name", async (req, res) => {
  try {
    // Get name from URL parameters
    const dishName = req.params.name;

    // Find a dish that matches the name, using .findOne()
    const dish = await Dish.findOne({ name: dishName });

    // If no dish is found, send 404: "Not Found"
    if (!dish) {
      return res.status(404).json({ error: "Dish was not found" });
    }

    // Send dish as json
    res.json(dish);
  } catch (err) {
    // Show error
    console.error("Error fetching dish by name:", err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new dish
router.post("/", async (req, res) => {
  try {
    // Extract dish data from request body
    const {
      name,
      ingredients,
      preparationSteps,
      cookingTime,
      origin,
      difficulty,
    } = req.body;

    // Check if it already exists
    const doesDishExist = await Dish.findOne({ name }); // null or the dish

    // If it does, send status code 409: "Conflict"
    if (doesDishExist) {
      return res.status(409).json({ error: "Dish already exists" });
    }

    // Create new dish
    const newDish = new Dish({
      name,
      ingredients,
      preparationSteps,
      cookingTime,
      origin,
      difficulty,
    });

    // Save new dish in the database
    await newDish.save();

    // Respond with 201 status: "Created", and the created dish as JSON
    res.status(201).json(newDish);
  } catch (err) {
    // Show error
    console.error("Error fetching dish by name:", err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error" });
  }
});

// PUT an updated dish based on id
router.put("/:id", async (req, res) => {
  // Extract updated dish data from request body
  const {
    name,
    ingredients,
    preparationSteps,
    cookingTime,
    origin,
    difficulty,
  } = req.body;

  // Check if all fields are provided for full update
  if (
    !name ||
    !ingredients ||
    !preparationSteps ||
    !cookingTime ||
    !origin ||
    !difficulty
  ) {
    // If any field is missing, respond with 400: "Bad Request"
    return res
      .status(400)
      .json({ error: "All fields required for full update" });
  }

  try {
    // Find the dish by ID, and update it with the new data
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // to return updated document (it doesn't do that automatically)
    });

    // If dish not found, respond with 404: "Not Found"
    if (!updatedDish) {
      return res
        .status(404)
        .json({ error: "Dish was not found, check the id" });
    }
    // Response with the updated dish
    res.json(updatedDish);
  } catch (err) {
    // Show error
    console.error("Error updating dish:", err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE dish based on id
router.delete("/:id", async (req, res) => {
  try {
    // Find the dish by ID and delete it
    const dishToDelete = await Dish.findByIdAndDelete(req.params.id);

    // If dish is not found, respond with 404: "Not Found"
    if (!dishToDelete) {
      return res
        .status(404)
        .json({ error: "Dish was not found, check the id" });
    }

    // Respond with status 200: "OK", a success message, and the deleted dish ID
    res
      .status(200)
      .json({ message: "Dish was deleted successfully", id: req.params.id });
  } catch (err) {
    // Show error
    console.error("Error deleting dish:", err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
