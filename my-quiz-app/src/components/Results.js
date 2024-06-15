import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalQuestions, correctAnswers, incorrectAnswers, skippedQuestions, tableName } = location.state;

  const attemptedQuestions = correctAnswers + incorrectAnswers;
  const totalPoints = correctAnswers * 5;
  const isHighScore = totalPoints >= 50;

  const attemptedData = {
    labels: ['Attempted', 'Unattempted'],
    datasets: [
      {
        data: [attemptedQuestions, totalQuestions - attemptedQuestions],
        backgroundColor: ['#FFA500', '#E0E0E0'],
        hoverBackgroundColor: ['#FFA500', '#E0E0E0'],
      },
    ],
  };

  const correctData = {
    labels: ['Correct', 'Incorrect', 'Skipped'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers, skippedQuestions],
        backgroundColor: ['#4CAF50', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#4CAF50', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const saveResults = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://quizzy-1-02jo.onrender.com/save-results', {
        userId: user.id,
        questionsAttempted: attemptedQuestions,
        correctAnswers,
        incorrectAnswers,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Save results response:', response.data);
    } catch (error) {
      console.error('Error saving results:', error.response ? error.response.data : error.message);
    }
  }, [user.id, attemptedQuestions, correctAnswers, incorrectAnswers]);

  useEffect(() => {
    if (user && user.id) {
      saveResults();
    }
  }, [user, saveResults]);

  const handleEmailReport = async () => {
    try {
      const doc = new jsPDF();

      // Cover Page
      doc.setFontSize(24);
      doc.text('Quiz Results Report', 20, 20);
      doc.setFontSize(16);
      doc.text(`User: ${user.username}`, 20, 40);
      doc.text(`Quiz: ${tableName}`, 20, 50);
      doc.text(`Total Questions: ${totalQuestions}`, 20, 60);
      doc.text(`Correct Answers: ${correctAnswers}`, 20, 70);
      doc.text(`Incorrect Answers: ${incorrectAnswers}`, 20, 80);
      doc.text(`Skipped Questions: ${skippedQuestions}`, 20, 90);
      doc.text(`Total Score: ${totalPoints} points`, 20, 100);
      doc.addPage();

      // Detailed Scores Page
      doc.setFontSize(20);
      doc.text('Detailed Scores', 20, 20);
      doc.autoTable({
        startY: 30,
        head: [['Total Questions', 'Correct Answers', 'Incorrect Answers', 'Skipped Questions', 'Score']],
        body: [[totalQuestions, correctAnswers, incorrectAnswers, skippedQuestions, `${totalPoints} points`]],
      });
      doc.addPage();

      // Charts Page
      doc.setFontSize(20);
      doc.text('Results Charts', 20, 20);
      const attemptedCanvas = document.getElementById('attemptedChart').toDataURL('image/png');
      const correctCanvas = document.getElementById('correctChart').toDataURL('image/png');
      doc.addImage(attemptedCanvas, 'PNG', 20, 30, 170, 100);
      doc.addPage();
      doc.addImage(correctCanvas, 'PNG', 20, 30, 170, 100);

      const pdfData = doc.output('datauristring');

      await axios.post('https://quizzy-1-02jo.onrender.com/send-report', {
        username: user.username,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        pdfData,
        tableName,
        totalPoints
      });

      alert('Report emailed successfully!');
    } catch (error) {
      console.error('Error sending report:', error.response ? error.response.data : error.message);
      alert('Error sending report: Network Error');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBackClick}>←</BackButton>
        <Title>Quiz Results</Title>
      </Header>
      <Content>
        <ChartsContainer>
          <ChartWrapper>
            <ChartTitle>Questions Attempted</ChartTitle>
            <Doughnut id="attemptedChart" data={attemptedData} options={{ cutout: '80%' }} />
            <ChartText>{attemptedQuestions} / {totalQuestions}</ChartText>
          </ChartWrapper>
          <ChartWrapper>
            <ChartTitle>Question Breakdown</ChartTitle>
            <Doughnut id="correctChart" data={correctData} options={{ cutout: '80%' }} />
            <ChartText>{correctAnswers} / {attemptedQuestions}</ChartText>
          </ChartWrapper>
        </ChartsContainer>
        <PointsContainer>
          {isHighScore ? (
            <GlitterText>Congratulations! You scored {totalPoints} points!</GlitterText>
          ) : (
            <MotivationalText>Good attempt! You scored {totalPoints} points. Keep trying to improve!</MotivationalText>
          )}
        </PointsContainer>
        <ButtonContainer>
          <Button onClick={handleEmailReport}>Email Report</Button>
          <Button onClick={() => navigate('/profile')}>Profile</Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #ccc;
  border-radius: 50%;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #4CAF50;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  text-align: center;
`;

const ChartText = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

const PointsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const glitter = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

const GlitterText = styled.h2`
  font-size: 24px;
  background: linear-gradient(45deg, #FFC107, #FF3D00, #4CAF50, #2196F3, #9C27B0);
  background-size: 400% 400%;
  animation: ${glitter} 2s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MotivationalText = styled.h2`
  font-size: 24px;
  color: #4CAF50;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

export default Results;
