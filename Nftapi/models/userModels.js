const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A user must have a name'],
        unique:true,
    },
    email:{
        type:String,
        requied:[true, 'A user must have an email'],
        unique:true,
        lowercase:true,
        validator:[validator.isEmail,"Please provide a valid Email"],
    },
    photo:{
        type: String,
    },
    role:{
        type:String,
        enum:['user','admin','guide','creator'],
        default:'user',
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,   
        select : false,    
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        minlength:8, 
        validator:{

         //This will work on save not on find and findone
            validator: function(el){
                return el===this.password
            },
            message:"Password is not same",
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false,
    }

});

userSchema.pre(/^find/,function(next){

   this.find({active:{$ne:false}});
next();
});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();
 
    //encrypting the password
    this.password =await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
});

userSchema.methods.correctPassword = async function(candiatePassword,userPassword){
    return await bcrypt.compare(candiatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){

    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken =  crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;