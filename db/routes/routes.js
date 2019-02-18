const express = require('express');
const Router = express.Router();
const {User} = require('./../models/user');
const _ = require('lodash');
const bodyParser = require('body-parser');

// Sighnup user 
Router.use(bodyParser.json());
Router.get('/',(req,res)=>{
    res.send("Hello from the server");
})
Router.post('/users',(req,res,next)=>{
    var body = _.pick(req.body,['name','username','surname','email','password']);
    var newUser = new User(body);
     
    newUser.save().then(()=>{
       return newUser.generateUserToken();
        
    }).then((token)=>{
        res.header('x-auth',token).send(newUser);
       
    },(e)=>{
        return Promise.reject(e);
    }).catch((e)=>{
        res.status(400).send(e);
    });
    

});
// Loging route which neets email and password 
Router.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    
    
       return User.findUser(body.email,body.password).then((user)=>{
       return user.generateUserToken().then((token)=>{
            res.header('x-auth',token).send(user)
        });
    }).catch((e)=>{res.status(400).send(e)});


});


module.exports = Router;