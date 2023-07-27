const mongoose = require('mongoose');

const lostSchema = new mongoose.Schema({
    category : {
        type : String ,
        required : [true , "Lost item must have category"] ,
        lowercase : true ,
        trim : true
    } ,
    title : {
        type : String ,
        required : [true , "Lost item must have title"] ,
        lowercase : true ,
        trim : true ,
        maxlength : [60 , "Lost item title must have less than 40 characters"] ,
    } ,
    description : {
        type : String ,
        required : [true , "Lost item must have description"] ,
        lowercase : true ,
        trim : true
    } ,
    images : {
        type : [String] ,
        required : [true , "Lost item must have images"] ,
    } ,
    owner : {
        type : mongoose.Schema.ObjectId ,
        ref : "User" ,
        required : [true , "Lost item must have owner"]
    } ,
    location : {
        type : {
            type : String ,
            default : "Point" ,
            enum : ["Point"]
        } ,
        coordinates : [Number] ,
    } ,
    returnReward : {
        type : Number ,
        required : [true , "Lost item must have return reward"] ,
        default : 10
    }
} , {
    toJSON : {virtuals : true} ,
    toObject : {virtuals : true}
})

lostSchema.virtual("comments" , {
    foreignField : "lostItem" ,
    localField : "_id" ,
    ref : "Comment"
})

lostSchema.pre(/^find/ , function(next) {
    this.populate("comments");
    next();
})

const Lost = mongoose.model("Lost" , lostSchema);

module.exports = Lost;