
var chai = require('chai')
var chaiHttp = require 
var should = chai.should()
var server = require('../index.js')


chai.use(chaiHttp);

require('../index.js')

describe('Users',function(){
describe ('POST user registration', function(){

    it('should register,provide unique username',function(done){

        chai.request(server)
        .post('/registration')
        .set('content-type','application/x-www-form-urlencoded')
        .send({
            username:'sphuyal',
            password:'kingdom123'
        })
        .end(function(err,res){


            res.should.have.status(200);
            done();
             })
        })

    })

})