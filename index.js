var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var authController = require("./Controllers/AuthController.js")
var userController = require("./Controllers/UserController.js")

var swaggerJSDoc=require("swagger-jsdoc");
var swaggerUI=require("swagger-ui-express");


var swaggerDefinition={
    info:{
        title:'MyApplication',
        description:"This is myapp documentation",
        version:"1.0.0"
    },
securityDefinitions:{
bearerAuth:{
    type:'apiKey',
    name:'authorizaton',
    in:'header',
    scheme:'bearer'
}
},
    host:"localhost:3002",
    basePath:"/"
}

var swaggerOptions={
    swaggerDefinition,
    apis:['./index.js']
}

var swaggerSpecs= swaggerJSDoc(swaggerOptions);

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpecs));





// app.get('/hospitallist',function(req,res,next){
//     console.log(req.query);
//     res.send('req recieved');
// })
// app.listen(3001);

app.use(bodyParser.urlencoded({extended:true}));

/**
 * @swagger
 * /registration:
 *  post:
 *   tags:
 *    - Users
 *   description: Users registration testing
 *   produces:
 *    - application/json
 *   comsumes:
 *    - application/x-www-form-urlencoded
 *   parameters:
 *    - name: username
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide unique username
 *    - name: password
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide password
 *    - name: address
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide address
 *   responses:
 *    200:
 *     description: registered sucessfully
 *    409:
 *     description: user already exists
 *    500:
 *     description: internal server error
 * 
 * 
 * 
 */



/**
 * @swagger
 * /login:
 *  post:
 *   tags:
 *    - Users
 *   description: Users login testing
 *   produces:
 *    - application/json
 *   comsumes:
 *    - application/x-www-form-urlencoded
 *   parameters:
 *    - name: username
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide unique username
 *    - name: password
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide password
 *  
 *   responses:
 *    200:
 *     description: login sucessfully
 *    400:
 *     description: incorrect password
 *    500:
 *     description: internal server error
 * 
 * 
 * 
 */
app.post('/login',authController.validation,authController.passwordChecker,authController.jwtTokenGen);

app.post('/registration',userController.Validator,userController.UserExist,
userController.genHash,userController.Register);
app.post('/profile', upload.single('image'),userController.UploadImage);




app.delete('/users/:id',authController.verifyToken,userController.deleteuser);

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *   tags:
 *    - Users
 *   security:
 *    - bearerAuth[]
 *   description: Delete user
 *   produces:
 *    - application/json
 *   comsumes:
 *    - application/x-www-form-urlencoded
 *   parameters:
 *    - name: id
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide unique username
 *   responses:
 *    200:
 *     description: Deleted sucessfully
 *    400:
 *     description: incorrect password
 *    500:
 *     description: internal server error
 * 
 * 
 * 
 */



app.listen(3002);