const { Client } = require("pg")





async function connectToDatabase() {
    try {
        console.log(`CONNECTING TO DATABASE...`)
        const client = new Client({
            user: 'postgres',
            password: 'postgres_malachi_12',
            host: "localhost",
            port: 5432,
            database: 'hngtask2db'
        })
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