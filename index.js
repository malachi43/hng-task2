require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const errorHandler = require('./middlewares/errorHandler.middleware')
const { validateUser: validateUserPayload } = require("./middlewares/validation.middleware")
const userController = require("./controllers/user.controller")
const authController = require("./controllers/auth.controller")
const organisationController = require("./controllers/organization.controller")
const isAuth = require("./middlewares/isAuthenticated")
const morgan = require("morgan");
const testDBconnection = require("./connect");
const createTable = require("./createTable");

//parse requests
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: false }));

//logger
app.use(morgan("dev"))


//Endpoints
app.post("/auth/register", validateUserPayload, authController.register)
app.post("/auth/login", authController.login)
app.get("/api/users/:id", isAuth, userController.getUser)
app.get("/api/organisations", isAuth, organisationController.getAllOrganisations)
app.post("/api/organisations", isAuth, organisationController.createOrganisation)
app.get("/api/organisations/:orgId", isAuth, organisationController.getOrganisation)
app.post("/api/organisations/:orgId/users", isAuth, organisationController.addUserToOrganisation)

//notFound handler
app.use((req, res) => {
    res.status(404).json({
        status: "page not found",
        message: "not_found",
        statusCode: 404
    })
})

//errorHandler
app.use(errorHandler);

app.listen(PORT, async () => {
    await testDBconnection();
    await createTable();
    console.log(`Server is listening on port: ${PORT}.Press Ctrl+C to terminate.`)
})
