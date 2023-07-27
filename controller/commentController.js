const Comment  = require('../model/commentModel');
const catchAsync = require("../utils/catchAsync");

exports.createComment = catchAsync(async(request , response , next) => {
    request.body.lostItem = request.params.lostItemId;
    request.body.user = request._user._id;

     await Comment.create(request.body);

    response.status(200).json({
        message : "Commented successfully"
    })

})

exports.deleteComment = catchAsync(async(request , response , next) => {
        const commentId = request.params.commentId;
        await Comment.findOneAndDelete({_id : commentId , user : request._user._id});

        response.status(200).json({
            message : "Comment deleted successfully"
        })
})