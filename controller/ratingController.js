const Rating = require('../model/userRating');
const catchAsync = require('../utils/catchAsync');

exports.postRating = catchAsync(async(request , response , next) => {
    request.body.targetUser = request.params.targetUser;
    request.body.user = request._user._id;

    await Rating.create(request.body);
    response.status(200).json({
        message : "Rating posted successfully"
    })
})

exports.deleteRating = catchAsync(async(request , response , next) => {
    await Rating.findOneAndDelete({user : request._user._id , _id : request.params.ratingId});
    response.status(200).json({
        message : "Rating deleted successfully"
    })
})