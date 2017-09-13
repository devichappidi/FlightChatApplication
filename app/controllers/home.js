//including dependencies.
var express = require('express');
var mongoose = require('mongoose');
var validator = require('../../middlewares/validator.js');

var router = express.Router();

//defining model.
var userModel = mongoose.model('User');

//defining controller function.
module.exports.controller = function(app){

router.get('/Users_List',function(req,res,next){
     userModel.find({}, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});
router.post('/Create_User',validator.idExist,function (req, res, next) {
/*var f;
userModel.find({"email":req.body.email}, function (err, result) {
       // console.log("result"+result);
        if (err) throw err;
if(result==null){
 f=0;
}
          return res.json(result);
    });*/
//if(f==0)
//{
   var today = Date.now();
    var newUser = new userModel({
   id : req.body.id,
  firstname:req.body.firstname,
  lastname:req.body.lastname,
  image:req.body.image,
  aboutme:req.body.aboutme
    });

    newUser.save(function(err,result){
      if(err){
        console.log(err);
   return res.status(500).json(
                    {
                      title:"Error",
                      msg:"Some Error Occured During Creation of user.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else if(result == undefined || result == null || result == ""){
     return res.status(404).json({
                      title:"Empty",
                      msg:"User Is Not Created. Please Try Again.",
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
//}
});
  //router for home.
  router.get('/',function(req,res){
    res.redirect('/user/login');
  });

  app.use(router);

}//end of controller function.
