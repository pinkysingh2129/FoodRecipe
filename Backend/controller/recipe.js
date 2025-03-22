const Recipes = require("../models/recipe");

// ✅ Get all recipes
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find();
        return res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get a single recipe
const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        return res.json(recipe);
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Add a new recipe (handles file upload)
// const addRecipe = async (req, res) => {
//     try {
//         const { title, ingredients, instructions, time } = req.body;

//         // ✅ Ensure required fields are provided
//         if (!title || !ingredients || !instructions || !req.file) {
//             return res.status(400).json({ message: "Required fields can't be empty" });
//         }

//         const ingredientsArray = JSON.parse(ingredients); // Convert JSON string to array
//         const imageUrl = `/uploads/${req.file.filename}`; // Save image path

//         const newRecipe = await Recipes.create({ title, time, ingredients: ingredientsArray, instructions, imageUrl });
//         return res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });

//     } catch (error) {
//         console.error("Error adding recipe:", error);
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

const addRecipe = async (req, res) => {
    try {
        console.log("📥 Incoming Data:", req.body);
        console.log("📸 Uploaded File:", req.file);

        const { title, time, ingredients, instructions } = req.body;

        if (!title || !time || !ingredients || !instructions || !req.file) {
            return res.status(400).json({ message: "Required fields can't be empty" });
        }

        let parsedIngredients;
        try {
            parsedIngredients = JSON.parse(ingredients);
            console.log("✅ Parsed Ingredients:", parsedIngredients);
        } catch (error) {
            console.error("❌ Error parsing ingredients:", error);
            return res.status(400).json({ message: "Invalid ingredients format" });
        }

        const newRecipe = new Recipe({
            title,
            time,
            ingredients: parsedIngredients,
            instructions,
            coverImage: req.file.filename,
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });

    } catch (error) {
        console.error("❌ Error adding recipe:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Edit an existing recipe
const editRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, time } = req.body;
        let updatedRecipe = { title, time, ingredients: JSON.parse(ingredients), instructions };

        if (req.file) {
            updatedRecipe.imageUrl = `/uploads/${req.file.filename}`; // Update image if uploaded
        }

        const recipe = await Recipes.findByIdAndUpdate(req.params.id, updatedRecipe, { new: true });
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        return res.json({ message: "Recipe updated successfully!", recipe });

    } catch (error) {
        console.error("Error updating recipe:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Delete a recipe
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        return res.json({ message: "Recipe deleted successfully!" });

    } catch (error) {
        console.error("Error deleting recipe:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe };
