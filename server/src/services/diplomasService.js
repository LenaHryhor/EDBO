const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');
const { getInstitutionId } = require('./institutionsService.js')
const { getOnePerson } = require('./personsService')

const getOneDimloma = async(series, number, name, surname, patronymic, type, global_type, birthday_date) => {
    if (birthday_date !== 'null') {
        try {
            const client = createConnection();
            const result = await client.query(`SELECT p.diploma_id, p.year_graduation, p.date_issue, p.series, p.number, p.type, p.global_type, f.long_name as institution_name FROM ((SELECT * FROM diplomas WHERE person_fk in (SELECT person_id FROM persons WHERE name = '${name}' AND patronymic = '${patronymic}' AND surname = '${surname}' AND birthday_date = '${birthday_date}') AND series = '${series}' AND number = '${number}' AND type = '${type}' AND global_type = '${global_type}') as p JOIN educational_institutions as f ON f.institution_id = p.institution_fk) JOIN persons as k ON k.person_id = p.person_fk`);
            client.end();
            return result.rows[0];
        } catch (err) {
            throw new SqlError(err.message)
        }
    } else {
        try {
            const client = createConnection();
            const result = await client.query(`SELECT p.diploma_id, p.year_graduation, p.date_issue, p.series, p.number, p.type, p.global_type, f.long_name as institution_name FROM ((SELECT * FROM diplomas WHERE person_fk in (SELECT person_id FROM persons WHERE name = '${name}' AND patronymic = '${patronymic}' AND surname = '${surname}') AND series = '${series}' AND number = '${number}' AND type = '${type}' AND global_type = '${global_type}') as p JOIN educational_institutions as f ON f.institution_id = p.institution_fk) JOIN persons as k ON k.person_id = p.person_fk`);
            client.end();
            return result.rows[0];
        } catch (err) {
            throw new SqlError(err.message)
        }
    }
}

const createOneDiploma = async({ type, global_type, series, number, year_graduation, date_issue, institution_name, name, surname, patronymic, p_series, p_number, authority_code, issue_date, birthday_date }) => {
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
        const result = await client.query(`INSERT into diplomas (type, global_type, series, number, year_graduation, date_issue, person_fk, institution_fk) VALUES ('${type}', '${global_type}', '${series}', '${number}', '${year_graduation}', '${date_issue}', ${person_id.person_id}, ${institution_id.institution_id} )`)
        client.end();
        return result.rows[0];
    } catch (err) {
        throw new SqlError(err.message)
    }
}


const updateOneDiploma = async({ diploma_id, type, global_type, series, number, year_graduation, date_issue, institution_name }) => {
    try {
        const institution_id = await getInstitutionId(institution_name);
        if (!institution_id) {
            throw new InvalidRequestError("Такого закладу не існує")
        }
        console.log(institution_id)
        const client = createConnection();
        await client.query(`UPDATE diplomas SET type = '${type}', global_type = '${global_type}', number = '${number}', series = '${series}', year_graduation = '${year_graduation}', date_issue = '${date_issue}', institution_fk = ${institution_id.institution_id} where diploma_id = ${diploma_id}`)
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}


module.exports = { getOneDimloma, createOneDiploma, updateOneDiploma };