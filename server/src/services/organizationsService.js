const createConnection = require('../db');
const { SqlError } = require('../utils/errors');

const getAllOrganizations = async() => {
    try {
        const client = createConnection();
        const result = await client.query(`SELECT  long_name from organizations;`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getAllOrganizations }