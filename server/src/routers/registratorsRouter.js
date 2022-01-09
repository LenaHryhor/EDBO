const asyncWrapper = require('../utils/apiUtils');
const { createQuery, getRegistrators, getQueries, getJournal, approveRegistrator, rejectRegistrator, changeStatus, updateRegistrator } = require('../controllers/registratorsController')
const { administratorMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.post('/query', asyncWrapper(createQuery));
router.get('/', administratorMiddleware, asyncWrapper(getRegistrators));
router.get('/queries', administratorMiddleware, asyncWrapper(getQueries));
router.get('/journal', administratorMiddleware, asyncWrapper(getJournal));
router.post('/approve', administratorMiddleware, asyncWrapper(approveRegistrator));
router.post('/reject', administratorMiddleware, asyncWrapper(rejectRegistrator));
router.patch('/status', administratorMiddleware, asyncWrapper(changeStatus));
router.put('/update', administratorMiddleware, asyncWrapper(updateRegistrator));

module.exports = router;