const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    addStudyMinutes,
    updateContentNotes,
    updateContentChecklist,
    updateContentQuestions,
    markContentAsCompleted
} = require('../controllers/topicController');

router.use(protect);

router.get('/', getTopics);
router.get('/:id', getTopicById);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);
router.post('/:id/study-minutes', addStudyMinutes);
router.put('/:id/contents/:contentId/notes', updateContentNotes);
router.put('/:id/contents/:contentId/checklist', updateContentChecklist);
router.put('/:id/contents/:contentId/questions', updateContentQuestions);
router.put('/:id/contents/:contentId/complete', markContentAsCompleted);

module.exports = router;