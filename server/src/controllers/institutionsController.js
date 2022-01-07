const { getInstitutionsByRegion, getInstitutionsByRegionAndName, createOneInstitution } = require('../services/institutionsService')

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
    const { code_edbo, long_name, short_name, code_identification, type, form, adress, region, city, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number, authority_code, issue_date, birthday_date } = req.body;
    await createOneInstitution({ code_edbo, long_name, short_name, code_identification, type, form, adress, region, city, phone, email, site, year_foundation, unit_institution, postal_code, global_type, position, name, surname, patronymic, p_series, p_number, authority_code, issue_date, birthday_date })
    res.status(200).json({ message: "Заклад created successfully" })
}

const updateInstitution = async(req, res) => {
    res.json();
}


module.exports = { getInstitutions, createInstitution, updateInstitution };