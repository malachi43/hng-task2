const { Client } = require("pg")
const client = new Client({
    user: 'postgres',
    password: 'postgres_malachi_12',
    host: "localhost",
    port: 5432,
    database: 'hngtask2db'
})

async function connectToDatabase() {
    try {
        console.log(`CONNECTING TO DATABASE...`)
        await client.connect();
        return client;
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectToDatabase;