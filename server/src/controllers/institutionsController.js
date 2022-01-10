const { getInstitutionsByRegion, getInstitutionsByRegionAndName, createOneInstitution } = require('../services/institutionsService')
const { createLog } = require('../services/logsService')

const getInstitutions = async(req, res) => {
    const { region, global_type, name } = req.query;
    let institutions;
    if (name == null) {
        institutions = await getInstitutionsByRegion(region, global_type);
    } else {
        console.log(global_type)
        institutions = await getInstitutionsByRegionAndName(region, global_type, name);
    }
    if (institutions.length === 0) {
        return res.status(400).json({ message: 'Немає записів з такими даними!' })
    }
    res.status(200).json(institutions);
}

const createInstitution = async(req, res) => {
    const { code_edbo, long_name, short_name, code_identification, type, form, adress, region, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number } = req.body;
    try {
        const result_row = await createOneInstitution({ code_edbo, long_name, short_name, code_identification, type, form, adress, region, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number })
        await createLog(req.user.user_id, 'Додавання', result_row, 'Заклади освіти')
        res.status(200).json({ message: "Заклад created successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateInstitution = async(req, res) => {
    const { institution_id, code_edbo, long_name, short_name, code_identification, type, form, adress, region, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number } = req.body;
    console.log(`${code_edbo} ${long_name} ${p_series} ${p_number} ${name} ${surname}`);
    await updateOneInstitution({ institution_id, code_edbo, long_name, short_name, code_identification, type, form, adress, region, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number })
    await createLog(req.user.user_id, 'Редагування', institution_id, 'Заклади освіти')
    res.status(200).json({ message: "Заклад  успішно оновлено" })
}


module.exports = { getInstitutions, createInstitution, updateInstitution };