var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var users = require("../Models/UserModel.js");

function validation(req,res,next){
 if(req.body.username === "" || req.body.password ===""){
    res.status(404);
    res.json({status:404,message:'please enter the given fields'})
 }
 else{
    users.findOne({
        where: {
            username:req.body.username
        }
    })
    .then(function(result){
        if (result === null){
            res.status(404);
            res.json({status:404,message:'username doesnt exist'});}
        else{
            req.passwordfromdb = result.dataValues.password;
            req.usernamefromdb = result.dataValues.username;
            next();
        }
    })
    .catch(function(err){
        res.json(err);
    })}
}

function passwordChecker(req,res,next){
bcrypt.compare(req.body.password,req.passwordfromdb)
.then(function(result){
    if(result === true){
    //console.log(result.dataValues);
    next();
    }
    else{
        res.status(404);
        res.json({status:404,message:"incorrect password"});
    }
})
.catch(function(err){
    res.json(err);
})
}

function jwtTokenGen(req,res,next){
    var myPayload = {
        username: req.usernamefromdb,
        userLevel: 'superadmin'
    }
    jwt.sign(myPayload, 'PleiadesIsMySecretKey', {expiresIn: "10h"},
    function(err,resultToken){
        console.log(err);
        console.log(resultToken);
        res.json({"userToken: ":resultToken})
    })
}


module.exports = {
    validation, passwordChecker,jwtTokenGen
}