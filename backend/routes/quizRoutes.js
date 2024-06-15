const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');

router.get('/quizzes', quizController.getQuizzes);
router.get('/quizzes/:tableName', quizController.getQuizQuestions);
router.get('/questions/count/:tableName', quizController.getQuestionsCount);
router.post('/check-answers/:tableName', quizController.checkAnswers);
router.post('/save-results', verifyToken, quizController.saveResults); // Ensure verifyToken is used
router.get('/user-statistics/:userId', verifyToken, quizController.getUserStatistics);
router.post('/send-report', quizController.sendReport);

module.exports = router;
