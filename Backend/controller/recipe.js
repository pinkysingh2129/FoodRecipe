const Recipes = require("../models/recipe");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ================= Multer + Cloudinary Storage =================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipes", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.replace(/\.[^/.]+$/, ""), // remove extension safely
  },
});

const upload = multer({ storage });

// ================= Controller Functions =================

// ✅ Public: Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// ✅ Private: Get logged-in user's recipes
const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const recipes = await Recipes.find({ createdBy: userId });
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch your recipes" });
  }
};

// ✅ Add new recipe
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions || !time) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // ✅ Ensure ingredients is stored as an array
    let fixedIngredients = ingredients;
    if (typeof ingredients === "string") {
      try {
        fixedIngredients = JSON.parse(ingredients);
      } catch {
        fixedIngredients = ingredients.split(",").map(i => i.trim());
      }
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients: fixedIngredients,
      instructions,
      time,
      coverImage: req.file.path || req.file.secure_url, // ✅ store actual Cloudinary URL
      createdBy: req.user.id,
    });

    return res.json(newRecipe);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add recipe",
      error: error.message,
    });
  }
};

// ✅ Edit recipe
const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { title, ingredients, instructions, time } = req.body;
    const coverImage = req.file?.path || req.file?.secure_url || recipe.coverImage;

    let fixedIngredients = ingredients;
    if (typeof ingredients === "string") {
      try {
        fixedIngredients = JSON.parse(ingredients);
      } catch {
        fixedIngredients = ingredients.split(",").map(i => i.trim());
      }
    }

    const updated = await Recipes.findByIdAndUpdate(
      req.params.id,
      { title, ingredients: fixedIngredients, instructions, time, coverImage },
      { new: true }
    );

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update recipe" });
  }
};

// ✅ Get single recipe by ID
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

// ✅ Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    return res.json({ status: "ok" });
  } catch (err) {
    return res.status(400).json({ message: "Error deleting recipe" });
  }
};

// ================= Export =================
module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  getMyRecipes,
};
