const { loginUser } = require('../controllers/authController')
const router = require('express').Router();
const asyncWrapper = require('../utils/apiUtils');

router.post('/login', asyncWrapper(loginUser));

module.exports = router