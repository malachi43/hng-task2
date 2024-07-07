const { ValidationError } = require("joi");

const errorHandler = (err, req, res, next) => {
    const validationObjRes = {
        error: [
            { field: "", message: err.name }
        ],
        error_code: err instanceof ValidationError ? 422 : 500
    }
    
    if (err instanceof ValidationError) {
        return res.status(validationObjRes.error_code).json({ errors: validationObjRes.error })
    }

    const BadRequestErrorRes = {
        status: "Bad request",
        message: "Registration unsuccessful",
        "statusCode": 400
    }

    if (err.name === "BadRequestError") {
        return res.status(400).json(BadRequestErrorRes)
    }

    res.status(validationObjRes.error_code).json({ errors: validationObjRes.error })
}

module.exports = errorHandler