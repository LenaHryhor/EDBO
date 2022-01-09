const asyncWrapper = require('../utils/apiUtils');
const { getInstitutions, createInstitution, updateInstitution } = require('../controllers/institutionsController')
const { registratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getInstitutions));
router.post('/create', registratorMiddleware, asyncWrapper(createInstitution));
router.put('/update', registratorMiddleware, asyncWrapper(updateInstitution));

module.exports = router;