const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');
const { getInstitutionId } = require('./institutionsService.js')
const { getOnePerson } = require('./personsService')


const getOneTicket = async(type, series, number, name, surname, patronymic) => {
    try {
        const client = createConnection();
        const result = await client.query(`SELECT p.student_ticket_id, p.start_date, p.end_date, p.series, p.number, f.long_name as institution_name FROM (SELECT * FROM students_tickets WHERE person_fk in (SELECT person_id FROM persons WHERE name = '${name}' AND patronymic = '${patronymic}' AND surname = '${surname}') AND series = '${series}' AND number = '${number}' AND type = ${type}) as p JOIN educational_institutions as f ON f.institution_id = p.institution_fk`)
        client.end();
        return result.rows[0];
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const createOneTicket = async(type, series, number, name, institution_name, surname, patronymic, start_date, end_date, p_series, p_number, authority_code, issue_date) => {
    try {
        let person_id = await getOnePerson({ p_series, p_number, name, surname })
        if (!person_id) {
            throw new InvalidRequestError("Такої людини не існує")
        }
        const institution_id = await getInstitutionId(institution_name);
        if (!institution_id) {
            throw new InvalidRequestError("Такого закладу не існує")
        }
        const client = createConnection();
        
        const result1 = await client.query(`SELECT * FROM students_tickets WHERE number = '${number}' AND series = ${series}`)
        if (result1.rows[0].student_ticket_id != undefined) {
            throw new InvalidRequestError("Такий number паспорту уже існує")
        }
        await client.query(`INSERT into students_tickets (type, number, series, start_date, end_date, person_fk, institution_fk) VALUES ('${type}', '${number}', '${series}' , '${start_date}', '${end_date}', ${person_id.person_id}, ${institution_id.institution_id} )`)
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const updateOneTicket = async({ student_ticket_id, type_int, series, number, institution_name, start_date, end_date }) => {
    try {
        const institution_id = await getInstitutionId(institution_name);
        if (!institution_id) {
            throw new InvalidRequestError("Такого закладу не існує")
        }
        const client = createConnection();
        const result1 = await client.query(`SELECT * FROM students_tickets WHERE number = '${number}' AND series = ${series}`)
        if (result1.rows[0].student_ticket_id != undefined) {
            throw new InvalidRequestError("Такий number паспорту уже існує")
        }
        await client.query(`UPDATE students_tickets SET type = ${type_int}, number = '${number}', series = '${series}' , start_date = '${start_date}', end_date = '${end_date}', institution_fk = ${institution_id.institution_id} where student_ticket_id = ${student_ticket_id}`)
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getOneTicket, createOneTicket, updateOneTicket };