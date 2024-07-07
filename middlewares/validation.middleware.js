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
        await userSchema.validateAsync(validateUser)
        next()
    } catch (error) {
        throw error
    }
}

module.exports = { validateUser }
