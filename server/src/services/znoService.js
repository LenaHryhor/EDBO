const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');
const { getOnePerson } = require('./personsService')

const getOneYearZno = async(year, number, name, surname, patronymic) => {
    try {
        const client = createConnection(year, number, name, surname, patronymic);
        const result = await client.query(`SELECT zno_id, result, subject FROM (SELECT * FROM zno WHERE person_fk in (SELECT person_id FROM persons ` +
            `WHERE name = '${name}' AND patronymic = '${patronymic}' AND  surname = '${surname}')` +
            `AND year = '${year}' AND number = '${number}') as f JOIN subjects ON subject_id = f.subject_fk;`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const createOneYearZno = async(year, number, name, surname, patronymic) => {
    // try {
    //     const client = createConnection(year, number, name, surname, patronymic);
    //     const result = await client.query(`SELECT zno_id, result, subject FROM (SELECT * FROM zno WHERE person_fk in (SELECT person_id FROM persons ` +
    //         `WHERE name = '${name}' AND patronymic = '${patronymic}' AND  surname = '${surname}')` +
    //         `AND year = '${year}' AND number = '${number}') as f JOIN subjects ON subject_id = f.subject_fk;`);
    //     client.end();
    //     return result.rows;
    // } catch (err) {
    //     throw new SqlError(err.message)
    // }
}


module.exports = getOneYearZno;