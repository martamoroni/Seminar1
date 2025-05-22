const mongoose = require("mongoose");

// Define a schema for Dish collection
const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ingredients: [String],
  preparationSteps: String,
  cookingTime: Number, // in minutes
  origin: String,
  difficulty: String,
});

// Export Dish model using the dishSchema
module.exports = mongoose.model("Dish", dishSchema);
