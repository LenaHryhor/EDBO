const { getOneYearZno, createOneYearZno, updateOneYearZno } = require('../services/znoService')
const { createLog } = require('../services/logsService')


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
    const { year, number, name, surname, patronymic, p_series, p_number, subj_result } = req.body;
    try {
        await createOneYearZno(year, number, name, surname, patronymic, p_series, p_number, subj_result, req.user.user_id)
            //await createLog(req.user.user_id, 'Додавання', result_row, 'Особи')
        res.status(200).json({ message: "ZNO certificates created successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateZno = async(req, res) => {
    const { old_number, number, old_year, year, results } = req.body;
    try {
        await updateOneYearZno(old_number, number, old_year, year, results, req.user.user_id);
        //await createLog(req.user.user_id, 'Редагування', zno_id, 'Сертифікати ЗНО')
        res.status(200).json({ 'message': 'successful' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



module.exports = { getZno, createZno, updateZno };