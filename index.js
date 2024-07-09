require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const getClient = require("./database")
const PORT = process.env.PORT || 3000;
const errorHandler = require('./middlewares/errorHandler.middleware')
const { validateUser: validateUserPayload } = require("./middlewares/validation.middleware")
const userController = require("./controllers/user.controller")
const authController = require("./controllers/auth.controller")
const organisationController = require("./controllers/organization.controller")
const isAuth = require("./middlewares/isAuthenticated")
const morgan = require("morgan");
const { Pool } = require("pg")

app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: false }));

//logger
app.use(morgan("dev"))
//3de59118-852b-47a6-af6e-d1553a5c4aae
app.post("/auth/register", validateUserPayload, authController.register)
app.post("/auth/login", authController.login)
app.get("/api/users/:id", isAuth, userController.getUser)
app.get("/api/organisations", isAuth, organisationController.getAllOrganisations)
app.post("/api/organisations", isAuth, organisationController.createOrganisation)
app.get("/api/organisations/:orgId", isAuth, organisationController.getOrganisation)
app.post("/api/organisations/:orgId/users", isAuth, organisationController.addUserToOrganisation)
app.use((req, res) => {
    res.status(404).json({
        status: "page not found",
        message: "not_found",
        statusCode: 404
    })
})
app.use(errorHandler);

app.listen(PORT, async () => {
    const pool = new Pool({
        connectionString: process.env.PG_CONN_STRING,
        ssl: true
    })

    const createUser = `CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(40) UNIQUE NOT NULL, 
        first_name VARCHAR(50) NOT NULL, 
        last_name VARCHAR(50) NOT NULL, 
        email VARCHAR(255) NOT NULL UNIQUE, 
        password TEXT NOT NULL, 
        phone VARCHAR(13)
        );`

    const createOrganization = `CREATE TABLE IF NOT EXISTS organisations (
            org_id VARCHAR(40) UNIQUE NOT NULL, 
            name VARCHAR(50) NOT NULL, 
            description TEXT,
            members VARCHAR(40) [],
            user_id VARCHAR(40) UNIQUE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
             );`

    await pool.query(createUser);
    await pool.query(createOrganization);

    console.log(`CONNECTED TO DATABASE SUCCESSFULLY.`)

    console.log(`Server is listening on port: ${PORT}.Press Ctrl+C to terminate.`)
})
