const mongoose = require("mongoose")

const recipeSchema = mongoose.Schema({
    title:{
        type:String,
    },
    time:{
        type:String,
    },
    ingredients: {
        type: Array,  // ✅ Correct array type
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