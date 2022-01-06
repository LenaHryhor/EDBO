const { getOneDiploma, createOneDiploma, updateOneDiploma } = require('../services/diplomasService')

const getDiploma = async(req, res) => {
    const { series, number, name, surname, patronymic, type, global_type, birthday_date } = req.query;
    const diploma = await getOneDiploma(series, number, name, surname, patronymic, type, global_type, birthday_date);

    if (!diploma) {
        return res.status(400).json({ message: 'Немає записів з такими даними!' })
    }
    diploma.type = type;
    diploma.surname = surname;
    diploma.name = name;
    diploma.patronymic = patronymic;
    diploma.birthday_date = birthday_date;
    res.status(200).json(diploma);
}

const createDiploma = async(req, res) => {
    const { type, global_type, series, number, year_graduation, date_issue, institution_name, name, surname, patronymic, p_series, p_number, authority_code, issue_date, birthday_date } = req.body;
    await createOneDiploma({ type, global_type, series, number, year_graduation, date_issue, institution_name, name, surname, patronymic, p_series, p_number, authority_code, issue_date, birthday_date })
    res.status(200).json({ message: "Diploma created successfully" })
}

const updateDiploma = async(req, res) => {
    const { diploma_id, type, global_type, series, number, year_graduation, date_issue, institution_name } = req.body;
    await updateOneDiploma({ diploma_id, type, global_type, series, number, year_graduation, date_issue, institution_name })
    res.status(200).json({ message: "Diploma updated successfully" })
}

module.exports = { getDiploma, createDiploma, updateDiploma };