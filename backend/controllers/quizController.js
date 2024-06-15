const db = require('../config/database');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gokulramesh033@gmail.com',
    pass: 'ofct gzju ywsm tsoj'
  }
});

exports.getQuizzes = (req, res) => {
  const getTablesQuery = 'SHOW TABLES';
  db.query(getTablesQuery, (err, tables) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to fetch quizzes' });
    }
    const quizPromises = tables.map(tableObj => {
      const tableName = Object.values(tableObj)[0];
      if (tableName === 'users' || tableName === 'user_statistics') return null;

      return new Promise((resolve, reject) => {
        const countQuery = `SELECT COUNT(*) AS count FROM ${tableName}`;
        db.query(countQuery, (err, results) => {
          if (err) return reject(err);
          resolve({ tableName, count: results[0].count });
        });
      });
    }).filter(Boolean);

    Promise.all(quizPromises)
      .then(quizzes => res.send(quizzes))
      .catch(err => res.status(500).send({ success: false, message: 'Failed to fetch quizzes' }));
  });
};

exports.getQuizQuestions = (req, res) => {
  const { tableName } = req.params;
  const query = 'SELECT * FROM ??';
  db.query(query, [tableName], (err, results) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to fetch questions' });
    }
    res.send(results);
  });
};

exports.getQuestionsCount = (req, res) => {
  const { tableName } = req.params;
  const query = 'SELECT COUNT(*) AS totalQuestions FROM ??';
  db.query(query, [tableName], (err, results) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to fetch questions count' });
    }
    res.send({ success: true, totalQuestions: results[0].totalQuestions });
  });
};

exports.checkAnswers = (req, res) => {
  const { tableName } = req.params;
  const { selectedOptions } = req.body;
  const questionIds = Object.keys(selectedOptions).map(id => parseInt(id));
  const query = 'SELECT id, correct_option FROM ?? WHERE id IN (?)';

  db.query(query, [tableName, questionIds], (err, results) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to check answers' });
    }
    const correctAnswers = results.filter(row => selectedOptions[row.id] == row.correct_option).length;
    res.send({ success: true, correctAnswers });
  });
};

exports.saveResults = (req, res) => {
  const { userId, questionsAttempted, correctAnswers, incorrectAnswers } = req.body;

  const getUsernameQuery = 'SELECT username FROM users WHERE id = ?';
  db.query(getUsernameQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching username:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch username' });
    }
    if (results.length > 0) {
      const username = results[0].username;

      const saveResultsQuery = `
        INSERT INTO user_statistics (user_id, username, questions_attempted, correct_answers, incorrect_answers)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        questions_attempted = questions_attempted + VALUES(questions_attempted),
        correct_answers = correct_answers + VALUES(correct_answers),
        incorrect_answers = incorrect_answers + VALUES(incorrect_answers)
      `;
      db.query(saveResultsQuery, [userId, username, questionsAttempted, correctAnswers, incorrectAnswers], (err) => {
        if (err) {
          console.error('Error saving results:', err);
          return res.status(500).send({ success: false, message: 'Failed to save results' });
        }
        res.send({ success: true, message: 'Results saved successfully' });
      });
    } else {
      res.status(404).send({ success: false, message: 'User not found' });
    }
  });
};


exports.getUserStatistics = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT 
      SUM(questions_attempted) AS total_questions_attempted,
      SUM(correct_answers) AS total_correct_answers,
      SUM(incorrect_answers) AS total_incorrect_answers
    FROM user_statistics
    WHERE user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to fetch statistics' });
    }
    res.send({ success: true, statistics: results[0] });
  });
};

exports.sendReport = (req, res) => {
  const { username, tableName, totalQuestions, correctAnswers, incorrectAnswers, skippedQuestions, pdfData } = req.body;

  const getUserEmailQuery = 'SELECT email FROM users WHERE username = ?';

  db.query(getUserEmailQuery, [username], (err, results) => {
    if (err) {
      console.error('Error fetching email:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch email' });
    }
    if (results.length > 0) {
      const recipientEmail = results[0].email;

      // Ensure the reports directory exists
      const reportsDir = './reports';
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }

      // Save the PDF data as a file
      const filePath = path.join(reportsDir, `${username}_quiz_report.pdf`);
      const pdfBuffer = Buffer.from(pdfData.split(',')[1], 'base64');
      fs.writeFileSync(filePath, pdfBuffer);

      // Email the PDF
      const mailOptions = {
        from: 'gokulramesh033@gmail.com',
        to: recipientEmail,
        subject: 'Quiz Results',
        text: `Here are your quiz results:\n\nTotal Questions: ${totalQuestions}\nCorrect Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}\nSkipped Questions: ${skippedQuestions}`,
        attachments: [
          {
            filename: 'quiz_report.pdf',
            path: filePath
          }
        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send({ success: false, message: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          return res.send({ success: true, message: 'Email sent successfully' });
        }
      });

    } else {
      return res.status(404).send({ success: false, message: 'User not found' });
    }
  });
};
