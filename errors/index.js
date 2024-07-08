class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = "BadRequestError"
    }
}

class UnauthenticatedError extends Error {
    constructor(message) {
        super(message)
        this.name = "UnauthenticatedError"
    }
}

module.exports = {BadRequestError, UnauthenticatedError}