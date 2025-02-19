const mongoose = require("mongoose")

const recipeSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    ingredients: {
        type: [String],  // ✅ Correct array type
        required: true
    },    
    instructions:{
        type:String,
        required:true
    },
    time:{
        type:String,
    },
    coverImage:{
        type:String,
    },
},{timestamps:true})

module.exports=mongoose.model("Recipe",recipeSchema)