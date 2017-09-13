var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var r={};
var resp;
var router = express.Router();
var groupModel=mongoose.model('Group');
var userModel=mongoose.model('User');
var validator = require('../../middlewares/validator.js');
module.exports.controller = function(app){
router.post('/Create_Group',function (req, res, next) {

   var today = Date.now();
    var newGroup = new groupModel({
groupname:req.body.groupname,
groupdescription:req.body.groupdescription,
members:req.body.members,
//origincode:req.body.origincode,
//destinationcode:req.body.destinationcode,
//duration:req.body.duration,
//price:req.body.price,
//arrivaltime:req.body.arrivaltime,
//departuretime:req.body.departuretime,
//origincity:req.body.origincity,
//destinationcity:req.body.destinationcity,
//createdOn:req.body.createdOn
    });

    newGroup.save(function(err,result){
      if(err){
        console.log(err);
   return res.status(500).json(
                    {
                      title:"Error",
                      msg:"Some Error Occured During Creation of group.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else if(result == undefined || result == null || result == ""){
     return res.status(404).json({
                      title:"Empty",
                      msg:"Group Is Not Created. Please Try Again.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else{
return res.status(200).json(result);
      }
    });
});
router.get('/Groups_List',function(req,res,next){
  groupModel.find({}, function (err, result) {       
        if (err) throw err;
	res.json(result);
		});
  });
router.post('/Groups_List',function(req,res,next){
  groupModel.find({ "members":req.body.members},function(err, docs){
     console.log(docs);
    return res.json(docs);
});
});

  router.post('/Groups_List/groupname',function(req,res,next){
  groupModel.find({"groupname":req.body.groupname}, function (err, result) {       
        if (err) throw err;
return res.json(result);
		});
  });
  
  
  router.post('/Join_Group',validator.groupExist,function (req, res, next) {

   var today = Date.now();
   
   console.log("hey"+req.body.members);
groupModel.findOne({"groupname":req.body.groupname},function(err,result){
//console.log("hey"+req.body.members);
result.members.push(req.body.members);
result.save(function(err, result) {
		if(err){ return res.status(404).json({status:'error occured while joining into the group'});}
	return res.status(200).json({status: 'joined into the group successfully'});
	});
});
  });
router.post('/Users_Info',function(req,res,next){
//var u=[];
//u.push(req.body.members);
console.log("ki"+req.body.members[1]);
  userModel.find({ id: {
            $in: req.body.members
        }
},function(err, docs){
     console.log(docs);
    return res.json(docs);
});
});
router.put('/Add_Aboutme',function (req, res, next) {
   var today = Date.now();
userModel.findOne({"id":req.body.id},function(err,result){
	if(err) throw err;
		result.aboutme=req.body.aboutme;
		result.save(function(err,result){
		if(err) { return res.status(404).json({status:'error while adding about me'});}
	return res.status(200).json({status: 'About me added successfully'});

	});
});
});

   

app.use(router);
}
