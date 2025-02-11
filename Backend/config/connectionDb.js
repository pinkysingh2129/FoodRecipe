const mongoose=require("mongoose")


const connectDb = async()=>{
    await mongoose.connecct(pprocess.env.CONNECTION_STRING)
    .then(()=>console.log("connected..."))
}

module.exports=connectDb