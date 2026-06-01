const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getActiveCycle,
    getAllCycles,
    getCycleById,
    createCycle,
    updateCycle,
    completeBlock,
    decrementBlockMinutes,
    deleteCycle,
    getCycleSummary
} = require('../controllers/cycleController');

router.use(protect);

router.get('/active', getActiveCycle);
router.get('/summary', getCycleSummary);
router.get('/', getAllCycles);
router.get('/:id', getCycleById);
router.post('/', createCycle);
router.put('/:id', updateCycle);
router.put('/:id/blocks/:blockId/complete', completeBlock);
router.put('/:id/blocks/:blockId/decrement', decrementBlockMinutes);
router.delete('/:id', deleteCycle);

module.exports = router;