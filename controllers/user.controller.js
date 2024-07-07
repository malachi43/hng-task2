const { BadRequestError } = require("../errors");
const getClient = require("../database")
class User {
    async getUser(req, res) {
        const { id } = req.params;
        if(!id) throw new BadRequestError(`missing user id.`)
        const client = await getClient();
    }
}