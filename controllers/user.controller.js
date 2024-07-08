const { BadRequestError } = require("../errors");
const getClient = require("../database")
class User {
    async getUser(req, res) {
        const { id } = req.params;
        if (!id) throw new BadRequestError(`missing user id.`)
        const client = await getClient();
        const userQuery = {}
        const getUser = `SELECT * FROM users WHERE user_id = $1`;
        const userValues = [id]
        userQuery.text = getUser;
        userQuery.values = userValues;
        const { rows } = await client.query(userQuery);
        if (rows.length <= 0) throw new BadRequestError(`no user with id:${id}`);
        const { first_name, last_name, user_id, phone, email } = rows[0];

        const dataObj = {
            "status": "success",
            "message": "request successful",
            "data": {
                "userId": user_id,
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
            }
        }

        if (phone) {
            dataObj.data.phone = phone
        }


        res.status(200).json(dataObj)

    }
}

module.exports = new User();
