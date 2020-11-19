const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
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