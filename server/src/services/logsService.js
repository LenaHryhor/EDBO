const createConnection = require('../db');
const { SqlError } = require('../utils/errors');

const createLog = async(registrator_id, modify_type, id_row, table_name) => {
    try {
        console.log(registrator_id, modify_type, id_row, table_name)
        const date = new Date()
        const client = createConnection();
        const result = await client.query(`insert into logs (registrar_fk, modify_type, id_row, table_name, date) values (${registrator_id}, '${modify_type}', '${id_row}', '${table_name}', '${date.toISOString()}')`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { createLog } 
