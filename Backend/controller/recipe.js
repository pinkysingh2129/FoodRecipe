const Recipes = require("../models/recipe");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// ✅ Public: All recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// ✅ Only logged-in user's recipes
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

// ✅ Add recipe
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions || !time) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id,
    });

    return res.json(newRecipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add recipe", error: error.message });
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
    const coverImage = req.file?.filename || recipe.coverImage;

    const updated = await Recipes.findByIdAndUpdate(
      req.params.id,
      { ...req.body, coverImage },
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

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  getMyRecipes, // ✅ keep separate
};

