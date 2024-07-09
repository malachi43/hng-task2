const { Client, Pool } = require("pg")


const pool = new Pool({
    connectionString: process.env.PG_CONN_STRING,
    ssl: true
})



async function connectToDatabase() {
    try {
        console.log(`CONNECTING TO DATABASE...`)
        await pool.connect();
        return pool;
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectToDatabase
