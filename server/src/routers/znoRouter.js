const asyncWrapper = require('../utils/apiUtils');
const { getZno, createZno, updateZno } = require('../controllers/znoController')
const { registratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getZno));
router.post('/create', registratorMiddleware, asyncWrapper(createZno));
router.put('/update', registratorMiddleware, asyncWrapper(updateZno));


module.exports = router;