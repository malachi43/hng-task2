const { UnauthenticatedError } = require("../errors")
const { decodeToken } = require("../utils")
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1]
        if (!token) throw new UnauthenticatedError(`Authenctication failed.`)
        const payload = await decodeToken(token)
        req.user = payload
        next()
    } catch (error) {
        throw new UnauthenticatedError(`Authentcation failed`)
    }

}

module.exports = isAuthenticated