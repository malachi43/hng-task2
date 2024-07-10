const { Client } = require("pg")

async function getClient() {
    try {
        const client = new Client({
            connectionString: process.env.PG_CONN_STRING,
            ssl: true
        })
        await client.connect();
        console.log(`client created!`)
        return client;
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = getClient;
