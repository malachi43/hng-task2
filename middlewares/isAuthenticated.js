const { UnauthenticatedError } = require("../errors")
const { decodeToken } = require("../utils")
const isAuthenticated = async (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1]
    if (!token) throw new UnauthenticatedError(`Authenctication failed.`)
    const payload = await decodeToken(token)
    req.user = payload
    console.log(`decoded payload: `, payload)
    next()
}

module.exports = isAuthenticated