const express = require("express")
const {getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload} = require("../controller/recipe");
const router = express.Router();

router.get("/",getRecipes)
router.get("/:id",getRecipe)
router.post("/", upload.single("file"), addRecipe);
router.put("/:id", upload.single("file"), editRecipe);
router.put("/:id",editRecipe)
router.delete("/:id",deleteRecipe)
// router.post('/recipe', async (req, res) => {
//     const { title, time, ingredients, instructions } = req.body;

//     if (!title || !time || !ingredients || !instructions) {
//         return res.status(400).json({ message: "Required fields can't be empty" });
//     }

//     // File Handling (if applicable)
//     if (!req.file.filename) {
//         return res.status(400).json({ message: "Image file is required" });
//     }


//     // Your logic to save the recipe
// });

module.exports= router