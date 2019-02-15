const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Auth',{useNewUrlParser:true,useCreateIndex:true}).then(()=>{
    console.log("Connected to MongoDb Server..");
})
module.exports={mongoose};