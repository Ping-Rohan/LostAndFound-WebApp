module.exports = function(reqbody , ...rest) {
    const validObj = {};
    rest.forEach(field => {
        validObj[field] = reqbody[field];
    })
    return validObj;
}