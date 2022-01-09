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

const getOneOrganization = async(long_name) =>{
    try {
        const client = createConnection();
        const result = await client.query(`SELECT * from organizations where long_name =  '${long_name}'`);
        client.end();
        return result.rows[0];
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getAllOrganizations, getOneOrganization }