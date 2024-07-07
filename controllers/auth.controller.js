require("dotenv").config();
const getClient = require("../database");
const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { createToken } = require("../utils")

const { BadRequestError, UnauthenticatedError } = require("../errors");
class Auth {

    async login(req, res) {
        const { email, password } = req;
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
        if (rows.length <= 0) throw new UnauthenticatedError(`Authentication failed`);
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
        // res.status(200).json(dataObj)
        console.log(dataObj)
    }
    async register(req, res) {
        try {
            const client = await getClient();
            const { firstName, lastName, email, password, phone } = req
            const userQuery = {}
            const orgQuery = {}

            const salt = 12;
            const passwordHash = await hash(password, salt)

            let createUser = ''
            const userValues = [uuidv4(), firstName, lastName, email, passwordHash]
            const createOrganisation = `INSERT INTO organisations(org_id, name) VALUES ($1,$2)`
            const orgValues = [uuidv4(), `${firstName}'s Organisation`]
            if (phone) {
                createUser = `INSERT INTO users (user_id,first_name,last_name,email,password,phone) VALUES ($1,$2,$3,$4,$5,$6)`
                userValues.push(phone)
            } else {
                createUser = `INSERT INTO users (user_id,first_name,last_name,email,password) VALUES ($1,$2,$3,$4,$5)`
            }

            userQuery.text = createUser;
            userQuery.values = userValues;

            orgQuery.text = createOrganisation;
            orgQuery.values = orgValues;

            await client.query(userQuery);
            await client.query(orgQuery);

            const { rows } = await client.query(`SELECT * FROM users;`)
            await client.query(`SELECT * FROM organisations;`)

            const { user_id, first_name, last_name, email: userEmail, phone: userContact } = rows[0]

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
            // res.status(201).json(dataObj);
            console.log(dataObj)
        } catch (error) {
            throw new BadRequestError(`Registration unsuccessful`)
        }

    }
}

module.exports = new Auth();
