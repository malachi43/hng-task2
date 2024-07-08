const getClient = require("../database");
const { BadRequestError } = require("../errors")

class Organisation {
    async getAllOrganisations(req, res) {
        const { user_id } = req.user
        const userQuery = {}
        const orgQuery = {}

        const getUser = `SELECT * FROM users WHERE user_id = $1;`

        const userValues = [user_id]
        const client = await getClient();
        userQuery.text = getUser;
        userQuery.values = userValues;

        const { rows: userData } = await client.query(userQuery);

        //check if users exists.
        if (userData.length <= 0) throw new BadRequestError(`no user with id: ${user_id}`)
        const { first_name } = userData[0];
        const OrgValues = [`${first_name}'s Organisation`]
        const getUserOrganisation = `SELECT * FROM organisations WHERE name = $1`;

        orgQuery.text = getUserOrganisation;
        orgQuery.values = OrgValues;

        const { rows } = await client.query(orgQuery);

        const dataObj = {
            status: "success",
            message: "request successful",
            data: {
                "organisations": rows
            }
        }

        res.status(200).json(dataObj);

    }

    async getOrganisation(req, res) {
        const { id } = req.params
        if (!id) throw new BadRequestError(`provide a valid id.`)
        const client = await getClient();
        const orgQuery = {}
        const getOrganisation = `SELECT * FROM organisations WHERE org_id = $1;`
        orgQuery.text = getOrganisation;
        orgQuery.values = [id]

        const { rows } = await client.query(orgQuery)

        const dataObj = {
            status: "success",
            message: "request successful",
            data: rows[0]
        }

        res.status(200).json(dataObj);
    }

}

module.exports = new Organisation();