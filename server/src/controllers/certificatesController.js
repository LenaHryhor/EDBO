const getOneCertificate = require('../services/certificatesService')

const getCertificate = async(req, res) => {
    const { year, number, name, surname, patronymic } = req.query;
    const certificate = await getOneCertificate(year, number, name, surname, patronymic);
    if (!certificate) {
        throw new InvalidRequestError('Немає записів з такими даними!')
    }
    certificate.surname = surname;
    certificate.name = name;
    certificate.patronymic = patronymic;
    console.log(certificate);
    res.json(certificate);
}

const createCertificate = async(req, res) => {
    res.json();
}

const updateCertificate = async(req, res) => {
    res.json();
}


module.exports = { getCertificate, createCertificate, updateCertificate }