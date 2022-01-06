const asyncWrapper = require('../utils/apiUtils');
const { getPerson, createPerson, updatePerson } = require('../controllers/personsController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getPerson));
router.post('/create', authMiddleware, asyncWrapper(createPerson));
router.put('/update', authMiddleware, asyncWrapper(updatePerson));

module.exports = router;