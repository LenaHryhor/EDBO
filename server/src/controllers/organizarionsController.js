const { getAllOrganizations } = require('../services/organizationsService')

const getOrganizations = async(req, res) => {
    const institutions = await getAllOrganizations()
    res.status(200).json(institutions);
}

module.exports = { getOrganizations };