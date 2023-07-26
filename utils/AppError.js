class AppError extends Error{
    constructor(msg , statusCode) {
        super(msg);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "Error" ;
        this.isOperational = true;
        Error.captureStackTrace(this , this.constructor);
    }
}

module.exports = AppError;