const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ =  require('lodash');
var UserSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            minlength:2
        },
        surname:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            required:true,
            type:String,
            unique:true,
            validate:function(value){
                return validator.isEmail(value);
            },
            message:"{VALUE} is not an email"
        },
        password:{
            type:String,
            required:true,
            minlength:1
        },
        tokens:[{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]
})
// Trim the data which is going to be sent to the client
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObj = user.toObject();
    return  _.pick(userObj,['email','username','name','surname','_id']);
}

UserSchema.methods.generateUserToken=function(){
     var user = this;
     var access = "auth"
     var token = jwt.sign({_id:user._id.toHexString(),password:user.password,access},'salt').toString()
     user.tokens.push({access,token});
    //  user.tokens.concat([access,token]);

   return user.save().then(()=>{
         return token
     }).catch((err)=>{
         return Promise.reject(err);
     });

}

// pre save mongoose middleware
UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    };
});


UserSchema.statics.findUser = function(email,password){
    var User = this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject('No user found');
        }
        

      return new Promise((resolve,reject)=>{
         bcrypt.compare(password,user.password,(err,result)=>{
             if(result){
                 resolve(user);
             }else{
                 reject("Athentication Failed ")
             }
         });
      });
    }).catch((e)=>{
        console.log(e);
        return Promise.reject(e);
    });
}

var User = mongoose.model("Users",UserSchema);
module.exports ={User};