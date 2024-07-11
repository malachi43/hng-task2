const joi = require('joi')


const validateUser = async (req, res, next) => {
    const userSchema = joi.object({
        firstName: joi.string().required().messages({
            'any.required': 'firstName is required'
        }),
        lastName: joi.string().required().messages({
            'any.required': 'lastName is required'
        }),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org", "gov"] } }).required().messages({
            'any.required': 'email is required'
        }),
        password: joi.string().required().messages({
            'any.required': 'password is required'
        }),
        phone: joi.string().optional()
    })

    try {
        await userSchema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        throw error
    }
}

const validateOrganisation = async (req, res, next) => {
    const orgSchema = joi.object({
        name: joi.string().required(),
        description: joi.string().optional()
    })

    try {
        await orgSchema.validateAsync(req.body)
        next()
    } catch (error) {
        throw error
    }
}

module.exports = { validateUser, validateOrg: validateOrganisation }
