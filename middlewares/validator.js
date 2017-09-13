//requiring dependencies.
var mongoose = require('mongoose');

var userModel = mongoose.model('User');
var groupModel = mongoose.model('Group');

//router level middleware for checking existing user.
module.exports.idExist = function(req,res,next){
  userModel.findOne({'id':req.body.id},function(err,result){
    if(err){
      res.render('message',
                  {
                    title:"Error",
                    msg:"Some Error Occured During id Checking.",
                    status:500,
                    error:err,
                    user:req.session.user
                  });
    } else if(result){
      return res.json(result);
    } else{
      next();
    }
  });
};
module.exports.groupExist = function(req,res,next){
  groupModel.findOne({"groupname":req.body.groupname},function(err,result){
    if(err){
      res.render('message',
                  {
                    title:"Error",
                    msg:"Some Error Occured During id Checking.",
                    status:500,
                    error:err,
                    user:req.session.user
                  });
    } else if(result){
      next();
    } else{
         var today = Date.now();
    var newGroup = new groupModel({
groupname:req.body.groupname,
groupdescription:req.body.groupdescription,
members:req.body.members,
origincode:req.body.origincode,
destinationcode:req.body.destinationcode,
duration:req.body.duration,
price:req.body.price,
arrivaltime:req.body.arrivaltime,
departuretime:req.body.departuretime,
origincity:req.body.origincity,
destinationcity:req.body.destinationcity,
createdOn:today
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
return res.status(200).json({status: 'joined into the group successfully'});
      }
    });
    }
  });
};
