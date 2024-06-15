require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/', authRoutes);
app.use('/', quizRoutes);

app.use('/reports', express.static(path.join(__dirname, 'reports')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
