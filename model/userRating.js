const mongoose = require('mongoose');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({
    stars : {
        type : Number ,
        required : [true , "Review must have stars"] ,
        min : 1,
        max : 5
    } ,
    reviewText : {
        type : String ,
        required : [true , "Review must have text"] ,
        trim : true
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : "User" ,
        required : [true , "Review must have user"]
    } ,
    targetUser : {
        type : mongoose.Schema.ObjectId ,
        ref : "User" ,
        required : [true , "Review must have target user"]
    }
})

reviewSchema.statics.calculateAverageStars = async function(userId) {
    const stats = await this.aggregate([{
        $group : {
                _id : '$targetUser' ,
                averageRating : {$avg : '$stars'}
        }
    }])

    if(stats.length === 0) {
        await User.findByIdAndUpdate(userId , {averageRating : 0});
        return;
    }
    
    await User.findByIdAndUpdate(userId , {averageRating : stats[0].averageRating});
}

reviewSchema.pre('save' , function(next) {
    this.constructor.calculateAverageStars(this.targetUser);
    next();
})

reviewSchema.post(/^findOneAnd/ , async function(doc){
    await doc.constructor.calculateAverageStars(doc.targetUser);
})

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;