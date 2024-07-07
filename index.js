require("express-async-errors");
const express = require("express");
const app = express();
const connectToDB = require("./database")
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: false }));


app.listen(PORT, async () => {
    const client = await connectToDB();

    const createUser = `CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(40) UNIQUE, 
    firstName VARCHAR(50) NOT NULL, 
    lastName VARCHAR(50) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    phone VARCHAR(13));`

    const createOrganization = `CREATE TABLE IF NOT EXISTS organisations (
    orgId VARCHAR(40) UNIQUE, 
    name VARCHAR(50) NOT NULL, 
    description TEXT );`
    const users = await client.query(createUser)
    const organisations = await client.query(createOrganization)

    console.log(`CONNECTED TO DATABASE SUCCESSFULLY.`)
    console.log(`Server is listening on port: ${PORT}.Press Ctrl+C to terminate.`)
})