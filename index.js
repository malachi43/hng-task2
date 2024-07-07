require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const getClient = require("./database")
const PORT = process.env.PORT || 3000;
const errorHandler = require('./middlewares/errorHandler.middleware')
const { validateUser } = require("./middlewares/validation.middleware")

app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: false }));



app.get("/", validateUser, (req, res) => {
    res.status(200);
})
app.use(errorHandler)

app.listen(PORT, async () => {
    const client = await getClient();
    const createUser = `CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(40) UNIQUE, 
    first_name VARCHAR(50) NOT NULL, 
    last_name VARCHAR(50) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    phone VARCHAR(13));`

    const createOrganization = `CREATE TABLE IF NOT EXISTS organisations (
    org_id VARCHAR(40) UNIQUE, 
    name VARCHAR(50) NOT NULL, 
    description TEXT );`
    const users = await client.query(createUser)
    const organisations = await client.query(createOrganization)

    console.log(`CONNECTED TO DATABASE SUCCESSFULLY.`)
    console.log(`Server is listening on port: ${PORT}.Press Ctrl+C to terminate.`)
})