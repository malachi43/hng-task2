const { Client } = require("pg")





async function connectToDatabase() {
    try {
        console.log(`CONNECTING TO DATABASE...`)
        const client = new Client({
            host: "dpg-cq6700rv2p9s73cgvbj0-a",
            user: "hngtask2user",
            password: "RdGhrp39iHegj6150uqFx7zyYkWVBCXz",
            port: 5432,
            database: "hngtask2db"
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