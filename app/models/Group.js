var mongoose = require('mongoose');

//declaring schema object.
var Schema = mongoose.Schema;
var groupSchema=new Schema({
groupname:{type:String,required:true, unique :true},
groupdescription:{type:String,required:true},
members:[String],
origincode:{type:String,required:true},
destinationcode:{type:String,required:true},
duration:{type:Number,required:true},
price:{type:String,required:true},
arrivaltime:{type:Date,required:true},
departuretime:{type:Date,required:true},
origincity:{type:String,required:true},
destinationcity:{type:String,required:true},
createdOn:{type:Date}
},{versionKey:false});

try {
    // Throws an error if "Name" hasn't been registered
    mongoose.model("Group")
} catch (e) {
    mongoose.model("Group", groupSchema)
}
 
