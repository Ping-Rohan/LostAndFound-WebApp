
function sendErrorDevelopment(error , response) {
    response.status(error.statusCode).json({
        message : error.message ,
        status : error.status ,
        stack : error.stack ,
    })
}

function sendErrorProduction(error , response) {

}


module.exports = function(error , request , response , next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error" ;
    console.log(process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(error , response);
    } else if(process.env.NODE_ENV === 'production') {
        sendErrorProduction(error , response);
    }
}