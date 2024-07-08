const joi = require('joi')


const validateUser = async (req, res, next) => {
    const userSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        phone: joi.string().optional()
    })

    try {
        await userSchema.validateAsync(req.body)
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
