const getOneDiploma = require('../services/diplomasService')

const getDiploma = async(req, res) => {
    const { series, number, name, surname, patronymic, type, global_type } = req.query;
    const diploma = await getOneDiploma(series, number, name, surname, patronymic);
    if (!diploma) {
        throw new InvalidRequestError('Немає записів з такими даними!')
    }

    diploma.global_type = global_type;
    diploma.type = type;
    diploma.surname = surname;
    diploma.name = name;
    diploma.patronymic = patronymic;
    res.status(200).json(diploma);
}

const createDiploma = async(req, res) => {
    res.json();
}

const updateDiploma = async(req, res) => {
    res.json();
}


module.exports = { getDiploma, createDiploma, updateDiploma };