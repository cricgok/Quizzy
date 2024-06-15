Quizzy


Quizzy is a web application that allows users to take quizzes, track their statistics, and receive detailed reports via email. The application includes features such as user authentication, quiz management, and statistical analysis.

Features

User Authentication: Secure login and registration for users.
Quiz Management: Users can attempt various quizzes and save their progress.
Statistics Tracking: Users can view their quiz statistics, including correct answers, incorrect answers, and skipped questions.
Email Reports: Detailed quiz reports are generated and sent to the user's email.
Responsive Design: Optimized for both desktop and mobile devices.
Installation

Clone the Repository:
git clone https://github.com/cricgok/quizzy.git
cd quizzy


Backend Setup:

Navigate to the backend directory and install dependencies:

cd backend
npm install
Create a .env file in the backend directory and add your environment variables:


PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret


Start the backend server:

npm start
Frontend Setup:

Navigate to the frontend directory and install dependencies:

cd ../frontend
npm install
Start the frontend development server:


npm start
Usage
User Registration and Login:

Open the application in your browser.
Register a new account or login with existing credentials.
Taking a Quiz:

Select a quiz from the available list.
Answer the questions and navigate through the quiz.
Submit the quiz to see your results.
Viewing Statistics:

Navigate to your profile to view detailed statistics of your quiz attempts.
Receiving Email Reports:

After completing a quiz, you can choose to receive a detailed report via email.