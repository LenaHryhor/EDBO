const { getAllRegistrators, getAllQueries, getJournalById, changeStatusById, createOneQuery, updateOneRegistrator } = require('../services/registratorsService')

const getRegistrators = async(req, res) => {
    const registrators = await getAllRegistrators();
    res.status(200).json(registrators)
}

const getQueries = async(req, res) => {
    const queries = await getAllQueries();
    res.status(200).json(queries)
}


const getJournal = async(req, res) => {
    const { registrator_id } = req.query;
    const journal = await getJournalById(registrator_id);
    res.status(200).json(journal)
}


const approveRegistrator = async(req, res) => {}


const rejectRegistrator = async(req, res) => {}


const changeStatus = async(req, res) => {
    const { registrator_id } = req.query;
    await changeStatusById(registrator_id);
    res.status(200).json({ "message": "Статус змінено успішно" })
}

const updateRegistrator = async(req, res) => {
    const { registrar_id, person_id, name, surname, patronymic, birthday_date, organization_name, position, email, p_series, p_number, authority_code, issue_date, identification_code } = req.body;
    await updateOneRegistrator({ registrar_id, person_id, name, surname, patronymic, birthday_date, organization_name, position, email, p_series, p_number, authority_code, issue_date, identification_code });
    res.status(200).json({ message: "Registrator updated successfully" })
}

const createQuery = (async(req, res) => {
    const { email, name, surname, patronymic, identification_code, p_series, p_number, issue_date, authority_code, position, organization_name, birthday_date } = req.body;
    await createOneQuery({ email, name, surname, patronymic, identification_code, p_series, p_number, issue_date, authority_code, position, organization_name, birthday_date });
    res.json({ message: 'Success!' });
});





module.exports = { createQuery, getRegistrators, getQueries, getJournal, approveRegistrator, rejectRegistrator, changeStatus, updateRegistrator };