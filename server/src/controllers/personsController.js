const { getOnePerson, createOnePerson, updateOnePerson } = require('../services/personsService')
const { createLog } = require('../services/logsService')

const getPerson = async(req, res) => {
    const { name, surname, p_series, p_number} = req.query;
    const person = await getOnePerson({ name, surname, p_series, p_number });
    if (!person) {
        return res.status(400).json({ message: 'Немаєs записів з такими даними!' })
    }
    res.status(200).json(person);
}

const createPerson = async(req, res) => {
    const { name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code } = req.body;
    const result_row = await createOnePerson({ name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code })
    await createLog(req.user.user_id, 'Додавання', result_row, 'Особи')
    res.status(200).json({ message: "Person created successfully" })
}


const updatePerson = async(req, res) => {
    const { person_id, name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code } = req.body;
    await updateOnePerson({ person_id, name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code })
    await createLog(req.user.user_id, 'Редагування', person_id, 'Особи')
    res.status(200).json({ message: "Person updated successfully" })
}

module.exports = { getPerson, createPerson, updatePerson };