const { Client } = require("pg");

const createTable = async () => {
    const client = new Client({
        connectionString: process.env.PG_CONN_STRING,
        ssl: true
    })

    await client.connect()




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
            user_id VARCHAR(40),
            FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
             );`

    await client.query(createUser);
    await client.query(createOrganization);
    await client.end();
    console.log(`created table!`)
}

module.exports = createTable
