require("dotenv").config();
const getClient = require("../database");
const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { createToken } = require("../utils")



const { BadRequestError, UnauthenticatedError } = require("../errors");
class Auth {

    async login(req, res) {
        const { email, password } = req.body;
        if (!password || !email) {
            throw new UnauthenticatedError(`Authentication failed`)
        }
        const client = await getClient();
        const userQuery = {}
        const findUser = `SELECT * FROM users WHERE email = $1;`;
        const userValues = [email]
        userQuery.text = findUser;
        userQuery.values = userValues;
        const { rows } = await client.query(userQuery)
        if (rows.length <= 0) throw new UnauthenticatedError(`incorrect email or password.`);
        const { password: hashedPassword, user_id, first_name, last_name, email: userEmail, phone } = rows[0]
        const isPasswordValid = await compare(password, hashedPassword)
        if (!isPasswordValid) throw new UnauthenticatedError(`Authentication failed`);
        const accessToken = await createToken({ payload: { userId: user_id } })
        const dataObj = {
            "status": "success",
            "message": "Login successful",
            "data": {
                accessToken,
                "user": {
                    "userId": user_id,
                    "firstName": first_name,
                    "lastName": last_name,
                    "email": userEmail,
                }
            }
        }
        if (phone) {
            dataObj.data.user.phone = phone
        }
        await client.end()
        res.status(200).json(dataObj)
    }
    async register(req, res) {

        const client = await getClient();
        const { firstName, lastName, email, password, phone } = req.body

        const userExists = await client.query(`SELECT * FROM users WHERE email = $1;`, [email])
        if (userExists.rows.length > 0) throw new BadRequestError(`already existing user.`);

        const userQuery = {}
        const orgQuery = {}

        const salt = 12;
        const passwordHash = await hash(password, salt)

        let createUser = ''
        const userValues = [uuidv4(), firstName, lastName, email, passwordHash]
        const createOrganisation = `INSERT INTO organisations(org_id, name,user_id,members) VALUES ($1,$2,$3,$4);`

        const orgValues = [uuidv4(), `${firstName}'s Organisation`]

        //check if client added their phone_number
        if (phone) {
            createUser = `INSERT INTO users (user_id,first_name,last_name,email,password,phone) VALUES ($1,$2,$3,$4,$5,$6);`
            userValues.push(phone)
        } else {
            createUser = `INSERT INTO users (user_id,first_name,last_name,email,password) VALUES ($1,$2,$3,$4,$5);`
        }


        userQuery.text = createUser;
        userQuery.values = userValues;

        await client.query(userQuery);

        const { rows } = await client.query(`SELECT * FROM users WHERE email = $1`, [email])
        const { user_id, first_name, last_name, email: userEmail, phone: userContact } = rows[0]

        //array to hold users in an organisation
        orgValues.push(user_id);
        let members = []
        members.push(user_id)
        //convert array items to string.
        members = members.join(",")
        orgValues.push(`{${members}}`)

        orgQuery.values = orgValues;
        orgQuery.text = createOrganisation;

        await client.query(orgQuery);

        const accessToken = await createToken({ payload: { userId: user_id } });

        const dataObj = {
            "status": "success",
            "message": "Registration successful",
            "data": {
                accessToken,
                "user": {
                    "userId": user_id,
                    "firstName": first_name,
                    "lastName": last_name,
                    "email": userEmail,
                }
            }
        }
        if (userContact) {
            dataObj.data.user.phone = userContact
        }
        await client.end()
        res.status(201).json(dataObj);
    }
}

module.exports = new Auth();
