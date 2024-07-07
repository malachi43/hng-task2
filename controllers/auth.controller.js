require("dotenv").config();
const getClient = require("../database");
const { hash } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
class Auth {
    #client;
    constructor() {

    }
    async login() {

    }
    async register(req, res) {

        const client = await getClient();
        const { firstName, lastName, email, password, phone } = req
        console.log(`number phone: `, phone)
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

        const { user_id, first_name, last_name, email: userEmail, password: hashedPassword, phone: userContact } = rows[0]

        const tokenExpiration = 1000 * 60 * 60 * 24 // 1 day
        const accessToken = jwt.sign({ userId: user_id }, process.env.JWT_SECRET, {
            expiresIn: tokenExpiration
        })

        const data = {
            "status": "success",
            "message": "Registration successful",
            "data": {
                accessToken,
                "user": {
                    "userId": user_id,
                    "firstName": first_name,
                    "lastName": last_name,
                    "email": userEmail,
                    "phone": userContact,
                }
            }
        }
        // res.status(201).json(data);
        console.log(data)
    }
}

const auth = new Auth()
auth.register({ firstName: 'Malachi', lastName: "Uko", password: "123455", phone: "09025044722", email: "ukomalachi@gmail.com" }, {})