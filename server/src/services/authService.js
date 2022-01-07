const createConnection = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var crypto = require("crypto");
const { LoginError, SqlError } = require('../utils/errors');
const { createOnePerson, getOnePerson } = require('./personsService')


const getToken = async(username, password) => {
    try {
        const client = createConnection();
        const registrar = await client.query(`SELECT password, registrar_id, status FROM public.registrars WHERE login = '${username}'`);
        client.end();
        if (registrar.rows[0]) {
            if (!(await bcrypt.compare(password, registrar.rows[0].password))) {
                throw new LoginError('Invalid username or password');
            }
            if (registrar.rows[0].status === false) {
                throw new LoginError('Деактивований акаунт');
            }
            const token = jwt.sign({
                user_id: registrar.registrar_id,
                username: username,
                role: "registrator"
            }, process.env.secret || 'secret');
            return token;
        }

        const client2 = createConnection();
        const registrar2 = await client2.query(`SELECT password, admin_id FROM public.admins WHERE login = '${username}'`);
        client2.end();
        if (registrar2.rows[0]) {
            if (!(await bcrypt.compare(password, registrar2.rows[0].password))) {
                throw new LoginError('Invalid username or password');
            }
            const token = jwt.sign({
                user_id: registrar2.registrar_id,
                username: username,
                role: "administrator"
            }, process.env.secret || 'secret');
            return token;
        }
        throw new LoginError('Invalid username or password');
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const addRegistrator = async(email, name, surname, patronymic, identification_code, p_series, p_number, issue_date, authority_code, position, organization_name, birthday_date) => {
    const password = crypto.randomBytes(10).toString('hex');
    const db_password = await bcrypt.hash(password, 10);
    const username = (email.split('@'))[0];
    try {
        let person_id = await getOnePerson({ p_series, p_number, name, surname })
        if (!person_id) {
            await createOnePerson({ name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code })
            person_id = await getOnePerson({ p_series, p_number, name, surname })
        }
        const client = createConnection();
        const organization = await client.query(`SELECT organization_id FROM public.organizations WHERE long_name = '${organization_name}'`);
        client.end();
        client2 = createConnection();
        await client3.query(`INSERT INTO registrars (identification_code, position, person_fk, email, organization_fk, login, password, status) VALUES ('${identification_code}', '${position}', ${person_id.person_id}, '${email}', ${organization.rows[0].organization_id},'${username}','${db_password}', 'true')`)
        client2.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = { getToken, addRegistrator };