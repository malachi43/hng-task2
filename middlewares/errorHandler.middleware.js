const { ValidationError } = require("joi");

const errorHandler = (err, req, res, next) => {
    const errorDetails = err.details?.map(err => ({
        field: err.context.key,
        message: err.message
    }));


    const validationObjRes = {
        error: [
            {
                field: errorDetails ? errorDetails : err.message,
                message: err.name
            }
        ],
        error_code: err instanceof ValidationError ? 422 : 500
    }

    if (err instanceof ValidationError) {
        return res.status(validationObjRes.error_code).json({ errors: validationObjRes.error })
    }

    const BadRequestErrorRes = {
        status: "Bad request",
        message: err.message,
        statusCode: err.name === "UnauthenticatedError" ? 401 : 400
    }

    if (err.name === "BadRequestError" || err.name === "UnauthenticatedError") {
        return res.status(400).json(BadRequestErrorRes)
    }

    res.status(400).json({
        "status": err.name,
        "message": err.message,
        "statusCode": err.statusCode ?? 500
    })
}

module.exports = errorHandler
