const { getOneCertificate, createOneCertificate, updateOneCertificate } = require('../services/certificatesService')

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
    const { year_graduation, number, position, comission_number, name, surname, patronymic, start_date, end_date, p_series, p_number } = req.body;
    try {
        await createOneCertificate({ year_graduation, number, position, comission_number, name, surname, patronymic, start_date, end_date, p_series, p_number })
        res.status(200).json({ message: "Certificate created successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateCertificate = async(req, res) => {
    const { certificate_id, year_graduation, number, position, comission_number, start_date, end_date } = req.body;
    try {
        await updateOneCertificate({ certificate_id, year_graduation, number, position, comission_number, start_date, end_date })
        res.status(200).json({ message: "Certificate updated successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { getCertificate, createCertificate, updateCertificate }