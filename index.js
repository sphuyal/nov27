var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var authController = require("./Controllers/AuthController.js")
var userController = require("./Controllers/UserController.js")

var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');


var swaggerDefinition = {
    info:{
        title:'myApplication',
        description: 'This is my app documentation',
        version: '1.0.0' //(New release,sometimes not backward compatible).(New feature, backward compatibility).(bug fix, backward compatibility)
    },
    securityDefinitions: {
        bearerAuth:{
            type:'apiKey',
            name:'authorization',
            in:'header',
            scheme:'bearer',
        }
    },
    host:'localhost:3006',
    basePath:'/'
};

var swaggerOptions = {
    swaggerDefinition,
    apis:['./index.js']
};

var swaggerSpecs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpecs));





// app.get('/hospitallist',function(req,res,next){
//     console.log(req.query);
//     res.send('req recieved');
// })
// app.listen(3001);

app.use(bodyParser.urlencoded({extended:true}));




app.post('/registration',userController.Validator,userController.UserExist,
userController.genHash,userController.Register);

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





app.post('/login',authController.validation,authController.passwordChecker,authController.jwtTokenGen);

app.post('/profile', upload.single('image'),userController.UploadImage);




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




app.delete('/users/:id',authController.verifyToken,userController.deleteuser);


/**
* @swagger
* /users/{id}:
*  delete:
*   tags:
*    - Delete user
*   description: Delete user from token testing
*   produces:
*    - application/json
*   consumes:
*    - application/x-www-form-urlencoded
*   security:
*    - bearerAuth: []
*   parameters:
*    - name: id
*      in: path
*      required: true
*      description: please enter id
*   responses:
*    200:
*     description: User Deleted sucessfully
*    500:
*     description: User not found
*/

app.listen(3006);

module.exports=app;