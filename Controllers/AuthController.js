var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var users = require("../Models/UserModel.js");
var secret = 'SphuyalMySecretKey';
function validation(req,res,next){
 if(req.body.username === "" || req.body.password ===""){
    res.status(204);
    res.json({status:406,message:'please enter the given fields'})
 }
 else{
    users.findOne({
        where: {
            username:req.body.username
        }
    })
    .then(function(result){
        if (result === null){
            res.status(409);
            res.json({status:409,message:'username doesnt exist'});}
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
    jwt.sign(myPayload, secret , {expiresIn: "10h"},
    function(err,resultToken){
        //console.log(err);
        console.log(resultToken);
        res.json({"userToken: ":resultToken})
    })
}

function verifyToken(req,res,next){
//auth bearer token
// header : authorization : Bearer ksaasdjhasdjsdhsdj
// URL/URI
if(req.headers.authorization === undefined){
    res.status(401);
    res.json({status:401,message:"unauthorized access"});
}
var token = req.headers.authorization;
token = token.slice(7, token.length).trimLeft();
jwt.verify(token,secret,
function(err,result){
    console.log(err,result);
if(result){
    console.log("correct token");
    next();
}
if(err){
    res.json({err});
}
})
}

module.exports = {
    validation, passwordChecker,jwtTokenGen,verifyToken
}