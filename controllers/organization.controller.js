const getClient = require("../database");
const { BadRequestError } = require("../errors")
const { v4: uuidv4 } = require("uuid");

class Organisation {
    async getAllOrganisations(req, res) {
        const { userId } = req.user
        const userQuery = {}
        const orgQuery = {}
        const getUser = `SELECT * FROM users WHERE user_id = $1;`

        const userValues = [userId]
        const client = await getClient();
        userQuery.text = getUser;
        userQuery.values = userValues;

        const { rows: userData } = await client.query(userQuery);

        //check if users exists.
        if (userData.length <= 0) throw new BadRequestError(`no user with id: ${userId}`)
        const { first_name } = userData[0];
        const OrgValues = [userId, userId]
        const getUserOrganisation = `SELECT org_id,name,description FROM organisations INNER JOIN users ON $1=$2 `;

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
        // const { userId } = req.user
        let name = "another Organisation";
        let description = "create organisation description"
        let userId = "35c50d6d-2deb-47d7-88c5-5206abfbb6f3"

        if (!name) throw new BadRequestError(`provide name field.`)
        const client = await getClient();
        const orgQuery = {}
        const createOrganisation = `INSERT INTO organisations (org_id, name, description,user_id,members) VALUES ($1,$2,$3,$4,$5) RETURNING *;`


        const orgValues = [uuidv4(), name, description, userId]

        let members = []
        members.push(userId)
        members = members.join(",");
        orgValues.push(`{${members}}`)

        orgQuery.text = createOrganisation;
        orgQuery.values = orgValues;

        const { rows } = await client.query(orgQuery)
        console.log(rows)
        const { org_id, name: orgName, description: orgDescription } = rows[0]

        const dataObj = {
            status: "success",
            message: "Organisation created successfully",
            data: {
                orgId: org_id,
                name: orgName,
            }
        }

        if (orgDescription) {
            dataObj.data.description = orgDescription
        }

        res.status(200).json(dataObj)
    }

    async addUserToOrganisation(req, res) {
        const { orgId } = req.body;
        const { userId } = req.user;
        if (!orgId) throw new BadRequestError(`provide valid orgId.`)
        const client = await getClient();
        const userQuery = {}
        const getUser = `SELECT * FROM users WHERE user_id = $1`;
        const userValues = [userId]
        userQuery.text = getUser;
        userQuery.values = userValues;
        const { rows: userData } = await client.query(userQuery)
        if (userData.length <= 0) throw new BadRequestError(`user does not exist.`)

        const orgQuery = {}
        const getOrganisation = `SELECT * FROM organisations WHERE org_id = $1;`
        const orgValues = [orgId];

        orgQuery.text = getOrganisation;
        orgQuery.values = orgValues;

        const { rows: orgData } = await client.query(orgQuery);
        const { members } = orgData[0]
        let updatedMembers = members
        const updateValues = []
        updatedMembers.push(userId)
        updatedMembers = updatedMembers.join(",");
        updateValues.push(`{${updatedMembers}}`)
        updateValues.push(orgId)
        const updateOrganisation = `UPDATE organisations SET members = $1 WHERE org_id = $2 RETURNING *;`
        const insertQuery = {
            text: updateOrganisation,
            values: updateValues
        }

        await client.query(insertQuery)

        const dataObj = {
            status: "success",
            message: "User added to organisation successfully",
        }

        res.status(200).json(dataObj);
    }
}

module.exports = new Organisation();