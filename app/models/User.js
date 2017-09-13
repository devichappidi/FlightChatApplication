var mongoose = require('mongoose');

//declaring schema object.
var Schema = mongoose.Schema;
var userSchema = new Schema({

  id :{type:String,reqired:true,unique : true},
  firstname:{type:String,required:true},
  lastname:{type:String,required:true},
  image:{type:String,required:true},
  aboutme:{type:String},
  createdOn : {type:Date,default:Date.now},
  updatedOn : {type:Date,default:Date.now}
},{versionKey:false});

//creating model.
try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("User")
} catch (e) {
    mongoose.model("User", userSchema)
}
 
