const { Client } = require('pg');
const client = new Client({
    // connectionString: process.env.DATABASE_URL,
    connectionString: "postgres://mtburmilevccie:1c22b8d4b0908a9819c5d4593efdb9ced5202aceab2977a6e426fcac3ce4df58@ec2-34-237-236-32.compute-1.amazonaws.com:5432/d3qj9alp37ad76",
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack));

const resultQuery = async(query) => {
    return await client.query(query)
        .then(res => {
            return res.rows
        })
        .catch(e => console.error(e.stack))
}

module.exports = { resultQuery, client }