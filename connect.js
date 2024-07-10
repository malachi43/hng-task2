const { Client } = require("pg");

    const connectPostgres = async () => {
        try {
            const client = new Client({
                connectionString: process.env.PG_CONN_STRING,
                ssl: true
            })
            await client.connect();
            const { rows } = await client.query(`SELECT $1::text as connected`, ["Connection to postgres successful!"])
            console.log(rows[0].connected);
            await client.end();
        } catch (error) {
            console.error(error.message)
        }
    }

    module.exports = connectPostgres
