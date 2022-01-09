const asyncWrapper = require('../utils/apiUtils');
const { getTicket, createTicket, updateTicket } = require('../controllers/ticketsController')
const { registratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getTicket));
router.post('/create', registratorMiddleware, asyncWrapper(createTicket));
router.put('/update', registratorMiddleware, asyncWrapper(updateTicket));

module.exports = router;