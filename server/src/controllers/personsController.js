const { getOnePerson, createOnePerson, updateOnePerson } = require('../services/personsService')

const getPerson = async(req, res) => {
    const { name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code } = req.query;
    const person = await getOnePerson({ name, surname, p_series, p_number });
    if (!person) {
        return res.status(400).json({ message: 'Немає записів з такими даними!' })
    }
    res.status(200).json(person);
}

const createPerson = async(req, res) => {
    const { name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code } = req.body;
    await createOnePerson({ name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code })
    res.status(200).json({ message: "Person created successfully" })
}


const updatePerson = async(req, res) => {
    const { person_id, name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code } = req.body;
    await updateOnePerson({ person_id, name, surname, patronymic, p_series, p_number, birthday_date, issue_date, authority_code })
    res.status(200).json({ message: "Person updated successfully" })
}

module.exports = { getPerson, createPerson, updatePerson };