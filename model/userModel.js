const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : [true , "Please provide a username"] ,
    } ,
    email : {
        type : String ,
        required : [true , "Please provide a email"] ,
        unique : true ,
        validate : [validator.isEmail , "Please provide a valid email"] ,
        lowercase : true
    } ,
    password : {
        type : String , 
        required : [true , "Please provide a password"] ,
        minLength : 8 ,
        select : false
    } ,
    confirmPassword : {
        type : String ,
        required : [true , "Please confirm your password"] ,
        validate : {
            validator : function(val) {
                return val === this.password;
            } ,
            message : "Password doesn't match"
        }
    } ,
    photo : {
        type : String ,
    } ,
    passwordChangedAt : Date ,
    passwordResetToken : String ,
    passwordResetTokenExpiresAt : String
})


userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 10);
    this.confirmPassword  = undefined;
    next();
});

userSchema.pre('save' , function(next) {
    if(!this.isModified('password') || this.isNew)  return next();
    this.passwordChangedAt = Date.now();
    next();
})


userSchema.methods.hasEnteredCorrectPassword = async function(candidatePassword , password) {
    return await bcrypt.compare(candidatePassword , password);
}

userSchema.methods.hasChangedPasswordRecently = function(jwtIssue) {
    if(this.passwordChangedAt) {
        const passwordChangedAtMS = parseInt(this.passwordChangedAt.getTime() /1000 , 10) ;
        return jwtIssue < passwordChangedAtMS;
    }
    return false;
}

const User = mongoose.model('User' , userSchema);

module.exports = User;