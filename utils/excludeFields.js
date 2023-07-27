module.exports = function(reqbody , ...rest) {
    const excludeObj = {...reqbody};
    rest.forEach(field => {
        delete excludeObj[field];
    });

    return excludeObj;
}