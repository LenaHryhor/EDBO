const asyncWrapper = require('../utils/apiUtils');
const { getDiploma, createDiploma, updateDiploma } = require('../controllers/diplomasController')
const { registratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getDiploma));
router.post('/create', registratorMiddleware, asyncWrapper(createDiploma));
router.put('/update', registratorMiddleware, asyncWrapper(updateDiploma));

module.exports = router;