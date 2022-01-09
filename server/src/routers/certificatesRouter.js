const asyncWrapper = require('../utils/apiUtils');
const { getCertificate, createCertificate, updateCertificate } = require('../controllers/certificatesController')
const { registratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/', asyncWrapper(getCertificate));
router.post('/create', registratorMiddleware, asyncWrapper(createCertificate));
router.put('/update', registratorMiddleware, asyncWrapper(updateCertificate));


module.exports = router;