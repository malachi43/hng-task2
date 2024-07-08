const { Client } = require("pg")





async function connectToDatabase() {
    try {
        console.log(`CONNECTING TO DATABASE...`)
        let  client = new Client({
            connectionString: process.env.PG_CONN_STRING
        })
        client = await client.connect();
        client.on("error", err => {
            if (err) process.exit(-1);
        })
        return client;
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectToDatabase;