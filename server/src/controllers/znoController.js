const getOneYearZno = require('../services/znoService')

const getZno = async(req, res) => {
    const { year, number, name, surname, patronymic } = req.query;
    const result = await getOneYearZno(year, number, name, surname, patronymic);
    if (result.length === 0) {
        return res.status(400).json({ message: 'Немає записів з такими даними!' })
    }
    const zno = {
        result: result,
        number: number,
        year: year,
        patronymic: patronymic,
        surname: surname,
        name: name
    }
    res.status(200).json(zno);
}

const createZno = async(req, res) => {
    res.json();
}

const updateZno = async(req, res) => {
    res.json();
}


module.exports = { getZno, createZno, updateZno };