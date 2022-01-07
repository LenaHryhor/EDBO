const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');
const { getOnePerson } = require('./personsService')

const getInstitutionsByRegion = async(region, global_type) => {
    try {
        const client = createConnection();
        const result = await client.query(`SELECT institution_id, code_edbo, long_name, short_name, code_identification, form, concat(address, ', ', city, ', ', region) as long_adress, type, phone, email, site, year_foundation, postal_code, unit_institution, position, p.name, p.surname, p.patronymic FROM public.educational_institutions JOIN persons as p ON p.person_id = head_fk WHERE region = '${region}' AND global_type = '${global_type}';`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const getInstitutionsByRegionAndName = async(region, global_type, name) => {
    try {
        const client = createConnection();
        const result = await client.query(`SELECT institution_id, code_edbo, long_name, short_name, code_identification, form, concat(address, ', ', city, ', ', region) as long_adress, type, phone, email, site, year_foundation, postal_code, unit_institution, position, p.name, p.surname, p.patronymic FROM public.educational_institutions JOIN persons as p ON p.person_id = head_fk WHERE region = '${region}' AND global_type = '${global_type}' AND long_name LIKE '%${name}%'`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const createOneInstitution = async({ code_edbo, long_name, short_name, code_identification, type, form, adress, region, city, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number, authority_code, issue_date, birthday_date }) => {
    try {
        let person_id = await getOnePerson({ p_series, p_number, name, surname })
        if (!person_id) {
            throw new InvalidRequestError("Такої людини не існує")
        }
        const client = createConnection();
        await client.query(`INSERT into institutions (code_edbo, long_name, short_name, code_identification, type, form, adress, region, city, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, person_fk ) VALUES ('${code_edbo}', '${long_name}', '${short_name}', '${code_identification}', '${type}', '${form}', '${adress}', '${region}', '${city}', '${phone}', '${email}', '${site}', '${year_foundation}', '${unit_institution}', '${postal_code}', '${global_type}', '${position}', ${person_id.person_id} )`)
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const getInstitutionId = async(institution_name) => {
    try {
        const client = createConnection();
        const institution = await client.query(`SELECT institution_id from educational_institutions where long_name = '${institution_name}'`)
        client.end();
        return institution.rows[0];
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getInstitutionsByRegion, getInstitutionsByRegionAndName, createOneInstitution, getInstitutionId };