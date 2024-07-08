const getClient = require("../database");
const { BadRequestError } = require("../errors")
const { v4: uuidv4 } = require("uuid");

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

    async createOrganisation(req, res) {
        // const { name, description } = req.body;
        let name = "";
        let description = `Getting started with third task`
        if (!name) throw new BadRequestError(`provide name field.`)
        const client = await getClient();
        const orgQuery = {}
        const createOrganisation = `INSERT INTO organisations(org_id, name, description) VALUES ($1,$2,$3) RETURNING *;`
        const orgValues = [uuidv4(), name, description]
        orgQuery.text = createOrganisation;
        orgQuery.values = orgValues;

        const { rows } = await client.query(orgQuery)
        const { org_id, name: orgName, description: orgDescription } = rows[0]

        const dataObj = {
            status: "success",
            message: "Organisation created successfully",
            data: {
                orgId: org_id,
                name: orgName,
            }
        }

        if(orgDescription){
            dataObj.data.description = orgDescription
        }

        console.log(dataObj)
        // res.status(200).json(dataObj)
    }

}

new Organisation().createOrganisation();
module.exports = new Organisation();