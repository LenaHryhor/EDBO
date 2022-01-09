const createConnection = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { LoginError, SqlError } = require('../utils/errors');


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
        const administrator = await client2.query(`SELECT password, admin_id FROM public.admins WHERE login = '${username}'`);
        client2.end();
        if (administrator.rows[0]) {
            if (!(await bcrypt.compare(password, administrator.rows[0].password))) {
                throw new LoginError('Invalid username or password');
            }
            const token = jwt.sign({
                user_id: administrator.admin_id,
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


module.exports = { getToken };