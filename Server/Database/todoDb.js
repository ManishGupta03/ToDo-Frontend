const mongoose = require("mongoose");
const clc = require("cli-color");
require('dotenv').config();

const todoDb = async ()=>{
  try{  
    await mongoose.connect(process.env.MONGO_URI); 
    console.log(clc.yellowBright("MongoDb connected successfully"));
  }
  catch(err){
    console.log(clc.redBright(err));
  };
};

module.exports = todoDb;