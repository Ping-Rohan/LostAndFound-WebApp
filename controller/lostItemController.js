const Lost = require("../model/lostItemModel");
const catchAsync = require("../utils/CatchAsync");
const validateFields = require("../utils/validateFields");
const excludeObj = require("../utils/excludeFields");

exports.createLostItem = catchAsync(async(request , response , next) => {
    request.body.owner = request._user._id;
    const lostItem = await Lost.create(request.body);
    response.status(201).json({
        status : "success" ,
        lostItem
    })
})

exports.updateLostItem = catchAsync(async(request , response , next) => {
    const itemId = request.params.id;
    const validatedFields = validateFields(request.body , "category" , "title" , "description");

    const updatedField = await Lost.findByIdAndUpdate(itemId , validatedFields , {
        runValidators : true ,
        new : true
    })

    response.status(200).json({
        message : "Successfully updated lost item" ,
        item : updatedField
    })
})


exports.getLostItem = catchAsync(async(request , response , next) => {
    const itemId = request.params.id;
    const lostItem = await Lost.findById(itemId);

    response.status(200).json({
        lostItem 
    })
})


exports.deleteLostItem = catchAsync(async(request , response , next) => {
    const itemId = request.params.id;
    await Lost.findOneAndDelete({_id : itemId , owner : request._user._id});

    response.status(200).json({
        message : "Successfully deleted lost item"
    })
})

exports.getAllLostItems = catchAsync(async(request , response , next) => {
    let query =  Lost.find();

    const filterObj = excludeObj(request.query , "page" , "limit" , "sort" , "fields");

    let queryStr = JSON.stringify(filterObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`);

    if(request.query.page) {
            const currentPage = request.query.page * 1 || 1;
            const limit = request.query.limit * 1 || 1;
            const skip = (currentPage - 1) * limit;

        query = query.skip(skip).limit(limit);
    }

    query = await query;

    response.status(200).json({
        dataLength : query.length ,
        LostItems : query
    })
})
