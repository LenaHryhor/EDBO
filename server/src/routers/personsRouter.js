const asyncWrapper = require('../utils/apiUtils');
const { getPerson, createPerson, updatePerson } = require('../controllers/personsController')
const { registratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getPerson));
router.post('/create', registratorMiddleware, asyncWrapper(createPerson));
router.put('/update', registratorMiddleware, asyncWrapper(updatePerson));

module.exports = router;