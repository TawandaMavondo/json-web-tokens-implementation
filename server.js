const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');


// Local Imports 
const {mongooseConfig}= require('./db/mongoose_config');
const {User} = require('./db/models/user');
const Router = require('./db/routes/routes');
var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());
app.use(Router);




// app.post('/users',(req,res)=>{
// var body = _.pick(req.body,['email','password']);
// var newUser = new User(body);

// newUser.save().then(()=>{
// newUser.generateUserToken();
// }).then((token)=>{
//     res.header('x-auth',token).send(newUser);
// }).catch((err)=>{
//     res.status(400).send(err);
// });

// });



app.listen(port,()=>{
    console.log(`The Server started on port ${port}`);
})