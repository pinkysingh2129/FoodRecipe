const express = require("express");
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  getMyRecipes
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// ✅ PUBLIC: Home page — shows all recipes
router.get("/", getRecipes);

// ✅ View single recipe by ID
router.get("/:id", getRecipe);

// ✅ Create recipe (only if logged in)
router.post("/", verifyToken, upload.single("file"), addRecipe);

// ✅ Update recipe (you can optionally protect this too)
router.put("/:id", upload.single("file"), editRecipe);

// ✅ Delete recipe
router.delete("/:id", deleteRecipe);

router.get("/my", verifyToken, getMyRecipes)

// ✅ Correct export (only once)
module.exports = router;
