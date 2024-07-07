const jwt = require("jsonwebtoken")

const createToken = async ({ payload }) => {
    const tokenExpiration = 1000 * 60 * 60 * 24 // 1 day
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: tokenExpiration })
}



module.exports = createToken