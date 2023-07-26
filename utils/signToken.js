const jwt = require('jsonwebtoken');

function signAccessToken(id) {
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}

function signRefreshToken(id) {
    return jwt.sign({id} , process.env.JWT_REFRESH_SECRET , {
        expiresIn : process.env.JWT_REFRESH_EXPIRES_IN
    })
}

exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;