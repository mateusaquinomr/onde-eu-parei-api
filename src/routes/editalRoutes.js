const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllEditais,
    getEditalById,
    createEdital,
    updateEdital,
    deleteEdital,
    getTopicsByEdital,
    getEditalProgress
} = require('../controllers/editalController');

router.use(protect);

router.get('/', getAllEditais);
router.get('/:id', getEditalById);
router.post('/', createEdital);
router.put('/:id', updateEdital);
router.delete('/:id', deleteEdital);
router.get('/:id/topics', getTopicsByEdital);
router.get('/:id/progress', getEditalProgress);

module.exports = router;