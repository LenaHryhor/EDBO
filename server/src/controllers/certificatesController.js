const { getOneCertificate, createOneCertificate, updateOneCertificate } = require('../services/certificatesService')
const { createLog } = require('../services/logsService')

const getCertificate = async(req, res) => {
    const { year, number, name, surname, patronymic } = req.query;
    const certificate = await getOneCertificate(year, number, name, surname, patronymic);
    if (!certificate) {
        return res.status(400).json({ message: 'Немає записів з такими даними!' })
    }
    if (certificate.end_date > Date.now()) {
        certificate.status = "Активний"
    } else {
        certificate.status = "Неактивний"
    }
    certificate.surname = surname;
    certificate.name = name;
    certificate.patronymic = patronymic;
    res.status(200).json(certificate);
}

const createCertificate = async(req, res) => {
    const { year_graduation, number, position, comission_number, name, surname, patronymic, start_date, end_date, p_series, p_number, authority_code, issue_date } = req.body;
    const result_row = await createOneCertificate({ year_graduation, number, position, comission_number, name, surname, patronymic, start_date, end_date, p_series, p_number, authority_code, issue_date })
    await createLog(req.user.user_id, 'Додавання', result_row, 'Сертифікати педагогічних правцівників')
    res.status(200).json({ message: "Certificate created successfully" })
}

const updateCertificate = async(req, res) => {
    const { certificate_id, year_graduation, number, position, comission_number, start_date, end_date } = req.body;
    await updateOneCertificate({ certificate_id, year_graduation, number, position, comission_number, start_date, end_date })
    await createLog(req.user.user_id, 'Редагування', certificate_id, 'Сертифікати педагогічних правцівників')
    res.status(200).json({ message: "Certificate updated successfully" })
}

module.exports = { getCertificate, createCertificate, updateCertificate }