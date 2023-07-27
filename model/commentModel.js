const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content : {
        type: String,
        required: [true, 'Please enter your comment!']
    },
    lostItem : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lostItem' ,
        required : [true , 'Please enter your lostItem!']
    },

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' ,
        required : [true , 'Please enter your user!']
    },
    
})

commentSchema.pre(/^find/ , function(next) {
    this.populate({
        path: 'user',
        select : '-email'
    });
    next();
})

const Comment = mongoose.model('Comment', commentSchema);


module.exports = Comment;