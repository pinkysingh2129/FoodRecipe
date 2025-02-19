const Recipes= require("../models/recipe")
const getRecipes  =async(req,res)=>{
    const recipes=await Recipes.find()
    return res.json(recipes)
}

const getRecipe  =async(req,res)=>{
    const recipe= await Recipes.findById(req.params.id)
    res.json(recipe)
}
const addRecipe = async (req, res) => {
    const { title, ingredients, instructions, time } = req.body;

    // ✅ Return early if required fields are missing
    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: "Required fields can't be empty" });
    }

    try {
        const newRecipe = await Recipes.create({ title, ingredients, instructions, time });
        return res.status(201).json(newRecipe);
    } catch (error) {
        console.error("Error adding recipe:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


const editRecipe  =(req,res)=>{
    res.json({message:"hello"})
}

const deleteRecipe  =(req,res)=>{
    res.json({message:"hello"})
}



module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe}