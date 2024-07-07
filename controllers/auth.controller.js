const client = require("../database")

class Auth {
    constructor() {

    }
    async login() {

    }
    async register(req, res) {
        const { firstName, lastName, email, password, phone } = req
        console.log(`phone number is req`, phone)
        const query = {}
        const values = [firstName, lastName, email, password]

        let createUser = ''
        if (phone) {
            createUser = `INSERT INTO users (firstName,lastName,email,password,phone) VALUES ($1,$2,$3,$4,$5)`
            values.push(phone)
        }
        createUser = `INSERT INTO users (firstName,lastName,email,password) VALUES ($1,$2,$3,$4)`
        query.text = createUser
        query.value = values

        console.log(query)
    }
}

const auth = new Auth()
auth.register({ firstName: 'Malachi', lastName: "Uko", password: "123455", phone: "09025044722", email: "ukomalachi@gmail.com" }, {})