const mongoose = require("mongoose")

const recipeSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    time:{
        type:String,
    },
    ingredients: {
        type: [String],  // ✅ Correct array type
        required: true
    },    
    instructions:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
},{timestamps:true})

module.exports=mongoose.model("Recipe",recipeSchema)