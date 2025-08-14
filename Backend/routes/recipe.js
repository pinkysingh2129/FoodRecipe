const express = require("express");
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  getMyRecipes,
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Public: all recipes
router.get("/", getRecipes);

// My recipes (must be before "/:id")
router.get("/my", verifyToken, getMyRecipes);

// Single recipe
router.get("/:id", getRecipe);

// Create recipe
router.post("/", verifyToken, upload.single("file"), addRecipe);

// Update recipe
router.put("/:id", upload.single("file"), editRecipe);

// Delete recipe
router.delete("/:id", deleteRecipe);

module.exports = router; // ✅ important — export router directly
