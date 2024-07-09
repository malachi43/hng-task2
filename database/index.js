const { Client } = require("pg")


const client = new Client({
    connectionString: process.env.PG_CONN_STRING,
    ssl: true
})



async function connectToDatabase() {
    try {
        console.log(`CONNECTING TO DATABASE...`)

        await client.connect();

        client.on("error", err => {
            if (err) process.exit(-1);
        })

        return client;

    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectToDatabase;