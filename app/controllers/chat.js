//including dependencies.
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../middlewares/auth.js');

var router = express.Router();
var chatModel= mongoose.model('Chat');

//defining controller function.
module.exports.controller = function(app){

  //router for chat window.
  app.get('/chat',auth.checkLogin,function(req,res){

    res.render('chat',
                {
                  title:"Chat Home",
                  user:req.session.user,
                  chat:req.session.chat
                });
  });
router.post('/chatroute',function(req,res){

    /*res.json(
                {
                  title:"Chat Home",
                  msgfrom:req.body.from,
                  msgto:req.body.to,
                  msg:req.body.msg,
                  time:req.body.time
                });*/
var today = Date.now();
   // var id = shortid.generate();
    //var epass = encrypt.encryptPassword(req.body.password);

    //create user.
    var newChat = new chatModel({

     /* userId : id,
      username : req.body.username,
      email : req.body.email,
      password : epass,
      createdOn : today,
      updatedOn : today*/
 msgFrom : req.body.msgFrom,
  msgTo : req.body.msgTo,
  msg : req.body.msg,
  room : req.body.room,
  createdOn : today


    });

    newChat.save(function(err,result){
      if(err){
        console.log(err);
   return res.json(
                    {
                      title:"Error",
                      msg:"Some Error Occured During Creation of chat.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else if(result == undefined || result == null || result == ""){
     return res.json({
                      title:"Empty",
                      msg:"User Is Not Created. Please Try Again.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else{
       /* req.user = result;
        delete req.user.password;
        req.session.user = result;
        delete req.session.user.password;
        res.redirect('/chat');*/
return res.status(200).json({status: 'Chat saved Successful!'});
      }
    });

  });
router.get('/chathistory',function(req,res,next){
  chatModel.find({}, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});
router.delete('/Clear_Chatmessage/:room/:objectId',function(req,res,next){
chatModel.remove({"room":req.params.room,"_id":req.params.objectId}, function (err, result){
if(err) throw err;
return res.status(200).json({status: 'chat message cleared successfully!'});
});
});
router.delete('/Clear_Chat/:room',function(req,res,next){
chatModel.remove({"room":req.params.room}, function (err, result){
if(err) throw err;
return res.status(200).json({status: 'chat history cleared successfully!'});
});
});

  app.use(router);

}//end of controller function.
