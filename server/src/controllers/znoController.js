const {getOneYearZno, createOneYearZno, updateOneYearZno}  = require('../services/znoService')

const getZno = async(req, res) => {
    const { year, number, name, surname, patronymic } = req.query;
    const result = await getOneYearZno(year, number, name, surname, patronymic);
    if (result.length === 0) {
        throw new InvalidRequestError('Немає записів з такими даними!')
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
    const {year, number, name, surname, patronymic, 
        birth_date, p_series, p_number, authority_code, issue_date, subj_result} = req.query;
   
    await createOneYearZno(year, number, name, surname, patronymic, 
        birth_date, p_series, p_number, authority_code, issue_date, subj_result)

    res.status(200).json({ message: "ZNO certificates created successfully" })
}

const updateZno = async(req, res) => {
    const { year, number, name, surname, patronymic, results} = req.query;
    const resultOld = await getOneYearZno(year, number, name, surname, patronymic);
    if (result.length === 0) {
        throw new InvalidRequestError('Немає записів з такими даними!')
    }
    const zno = {
        result: resultOld,
        number: number,
        year: year,
        patronymic: patronymic,
        surname: surname,
        name: name
    }
   
        const result2 = await updateOneYearZno(year, number, name, surname, patronymic, resultOld, results);
        if (result2.length === 0) {
            throw new InvalidRequestError('Помилка оновлення запису!')
        }

    res.status(200).json(zno);
}


module.exports = { getZno, createZno, updateZno };