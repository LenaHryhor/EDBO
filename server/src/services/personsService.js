const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');

const getOnePerson = async({ name, surname, p_series, p_number }) => {
    try {
        const client = createConnection();
        const result = await client.query(`SELECT * FROM public.persons WHERE series = '${p_series}' AND surname = '${surname}' AND name = '${name}' AND number = '${p_number}'`);
        client.end();
        return result.rows[0];
    } catch (err) {
        throw new SqlError(err.message)
    }
}


const createOnePerson = async({ name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code }) => {
    try {
        const client = createConnection();
        const authority = await client.query(`SELECT authority_id FROM public.authorities WHERE code = '${authority_code}'`);
        client.end();
        if (!authority.rows[0]) {
            throw new InvalidRequestError("Такого коду не існує")
        }
        const client2 = createConnection();
        await client2.query(`INSERT INTO persons (name, surname, patronymic, series, number, issue_date, birthday_date, authorities_fk) VALUES ('${name}', '${surname}', '${patronymic}', '${p_series}', '${p_number}', '${issue_date}', '${birthday_date}', ${authority.rows[0].authority_id})`)
        client2.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const createOnePersonWithAuthorityFk = async({ name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_fk }) => {
    try {
        const client = createConnection();
        await client.query(`INSERT INTO persons (name, surname, patronymic, series, number, issue_date, birthday_date, authorities_fk) VALUES ('${name}', '${surname}', '${patronymic}', '${p_series}', '${p_number}', '${issue_date}', '${birthday_date}', ${authority_fk})`)
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const updateOnePerson = async({ person_id, name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code }) => {
    try {
        const client = createConnection();
        const authority = await client.query(`SELECT authority_id FROM public.authorities WHERE code = '${authority_code}'`);
        client.end();
        if (!authority.rows[0]) {
            throw new InvalidRequestError("Такого коду не існує")
        }
        const client2 = createConnection();
        await client2.query(`UPDATE persons SET name = '${name}', surname = '${surname}', patronymic = '${patronymic}' , series = '${p_series}', number = '${p_number}', birthday_date = '${birthday_date}', authorities_fk = '${authority.rows[0].authority_id}', issue_date = '${issue_date}' where person_id = ${person_id}`)
        client2.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getOnePerson, createOnePerson, updateOnePerson, createOnePersonWithAuthorityFk };