const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ingredients: [String],
  preparationSteps: String,
  cookingTime: Number,
  origin: String,
  difficulty: String,
});

module.exports = mongoose.model("Dish", dishSchema);
