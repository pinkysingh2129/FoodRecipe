const Recipes = require("../models/recipe");
const multer = require('multer');

const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, './uploads'); // ✅ now storing in uploads
},
filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.fieldname;
    cb(null, filename);
}
});

const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Check if request is for /recipe/my path
    if (req.originalUrl.includes("/recipe/my") && userId) {
      const recipes = await Recipes.find({ createdBy: userId });
      return res.json(recipes);
    }

    // Otherwise return all recipes
    const recipes = await Recipes.find();
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

const getRecipe = async (req, res) => {
try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
} catch (err) {
    return res.status(500).json({ message: "Failed to fetch recipe" });
}
};

const addRecipe = async (req, res) => {
try {
    console.log(req.user);
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
    createdBy: req.user.id
    });
    return res.json(newRecipe);
} catch (error) {
    return res.status(500).json({ message: "Failed to add recipe", error: error.message });
}
};

const editRecipe = async (req, res) => {
const { title, ingredients, instructions, time } = req.body;
let recipe = await Recipes.findById(req.params.id);

try {
    if (recipe) {
    let coverImage = req.file?.filename ? req.file?.filename : recipe.coverImage;
    await Recipes.findByIdAndUpdate(req.params.id, { ...req.body, coverImage }, { new: true });
    res.json({ title, ingredients, instructions, time });
    }
} catch (err) {
    return res.status(404).json({ message: err });
}
};

const deleteRecipe = async (req, res) => {
try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
} catch (err) {
    return res.status(400).json({ message: "error" });
}
};

const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const recipes = await Recipes.find({ createdBy: userId });
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch your recipes" });
  }
};


module.exports = {
getRecipes,
getRecipe,
addRecipe,
editRecipe,
deleteRecipe,
upload,
getMyRecipes
};
