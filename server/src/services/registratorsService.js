const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');
const { createOnePerson, getOnePerson, updateOnePerson } = require('./personsService');
const { getOneOrganization } = require('./organizationsService');

const getAllRegistrators = async() => {
    try {
        const client = createConnection();
        const result = await client.query(`select registrar_id, name, surname, patronymic, birthday_date, long_name as organization_name, position, registrars.email, series, number, code as authority_code, issue_date, identification_code, status, person_id from ((registrars join persons on registrars.person_fk = persons.person_id) join organizations on organization_fk = organization_id) join authorities on persons.authorities_fk = authorities.authority_id`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const getAllQueries = async() => {
    try {
        const client = createConnection();
        const result = await client.query(`select query_id, name, surname, patronymic, queries.birthdy_date, long_name as organization_name, position, queries.email, series, number, code as authority_code, issue_date, identification_code, status from (queries join organizations on organization_fk = organization_id) join authorities on queries.authority_fk = authorities.authority_id`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const getJournalById = async(registrator_id) => {
    try {
        const client = createConnection();
        const result = await client.query(`select * from logs where registrar_fk = '${registrator_id}'`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const changeStatusById = async(registrator_id) => {
    try {
        let status = false
        const client = createConnection();
        const result = await client.query(`select status from registrars where registrar_id = '${registrator_id}'`);
        client.end();
        console.log(result)
        if (result.rows[0].status == false) {
            status = true;
        }
        const client2 = createConnection();
        await client2.query(`update registrars set status = ${status} where registrar_id = '${registrator_id}'`);
        client2.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const createOneQuery = async({ email, name, surname, patronymic, identification_code, p_series, p_number, issue_date, authority_code, position, organization_name, birthday_date }) => {
    // const password = crypto.randomBytes(10).toString('hex');
    // const db_password = await bcrypt.hash(password, 10);
    // const username = (email.split('@'))[0];
    try {
        // let person_id = await getOnePerson({ p_series, p_number, name, surname })
        // if (!person_id) {
        //     await createOnePerson({ name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code })
        //     person_id = await getOnePerson({ p_series, p_number, name, surname })
        // }
        const client = createConnection();
        const organization = await client.query(`SELECT organization_id FROM public.organizations WHERE long_name = '${organization_name}'`);
        client.end();
        const client2 = createConnection();
        const authority = await client2.query(`SELECT authority_id FROM public.authorities WHERE code = '${authority_code}'`);
        client2.end();
        console.log(authority_code)
        if (!authority.rows[0]) {
            throw new InvalidRequestError("Такого коду не існує")
        }
        client3 = createConnection();
        await client3.query(`INSERT INTO queries (name, surname, patronymic, series, number, issue_date, identification_code, position, email, organization_fk, authority_fk, birthday_date, status) VALUES ('${name}', '${surname}', '${patronymic}', '${p_series}', '${p_number}', '${issue_date}', '${identification_code}', '${position}', '${email}', ${organization.rows[0].organization_id}, ${authority.rows[0].authority_id}, '${birthday_date}', 2)`)
        client3.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const updateOneRegistrator = async({registrar_id, person_id, name, surname, patronymic, birthday_date, organization_name, position, email, p_series, p_number, authority_code, issue_date, identification_code }) => {
     try {
        let organization = await getOneOrganization(organization_name);
        if(!organization){
            throw new InvalidRequestError("Немає такої організації")
        }
        
        var organization_id = organization.organization_id;
        await updateOnePerson ({ person_id, name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code });
        
        const client = createConnection();
        await client.query(`UPDATE registrars SET position = '${position}', organization_fk = '${organization_id}', identification_code = '${identification_code}', email = '${email}' WHERE registrar_id = '${registrar_id}'`)
        
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getAllRegistrators, getAllQueries, getJournalById, changeStatusById, createOneQuery, updateOneRegistrator };