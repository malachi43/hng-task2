const jwt = require("jsonwebtoken")

const decodeToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = decodeToken;
