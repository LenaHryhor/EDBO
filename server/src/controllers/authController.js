const { getToken } = require('../services/authService')

const loginUser = async(req, res) => {
    const {
        username,
        password
    } = req.body;

    const token = await getToken(username, password);

    res.status(200).json({
        token: token
    })
}

module.exports = { loginUser };