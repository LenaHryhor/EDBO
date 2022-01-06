const asyncWrapper = require('../utils/apiUtils');
const { getTicket, createTicket, updateTicket } = require('../controllers/ticketsController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getTicket));
router.post('/create', authMiddleware, asyncWrapper(createTicket));
router.put('/update', authMiddleware, asyncWrapper(updateTicket));

module.exports = router;