import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username || '');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`https://quizzy-1-02jo.onrender.com/user-statistics/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.statistics) {
          const { total_correct_answers, total_questions_attempted, total_incorrect_answers } = response.data.statistics;
          setCorrectAnswers(total_correct_answers);
          setQuestionsAttempted(total_questions_attempted);
          setIncorrectAnswers(total_incorrect_answers);
        }
      } catch (error) {
        console.error('Error fetching user statistics:', error.response ? error.response.data : error.message);
      }
    };

    if (user && user.id) {
      setUsername(user.username);
      fetchUserStatistics();
    }
  }, [user]);

  const accuracy = questionsAttempted ? ((correctAnswers / questionsAttempted) * 100).toFixed(2) : 0;

  const data = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['#4CAF50', '#FF6384'],
        hoverBackgroundColor: ['#4CAF50', '#FF6384'],
      },
    ],
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Quiz Results', 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['Total Questions', 'Correct Answers', 'Incorrect Answers']],
      body: [[questionsAttempted, correctAnswers, incorrectAnswers]],
    });
    doc.save('quiz_results.pdf');
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBackClick}>←</BackButton>
        <Title>Profile</Title>
      </Header>
      <Content>
        <Card>
          <Subtitle>Quiz Statistics</Subtitle>
          <ChartContainer>
            <Doughnut data={data} />
          </ChartContainer>
        </Card>
        <DetailsCard>
          <Info>
            <Label>Username:</Label>
            <Value>{username}</Value>
          </Info>
          <Info>
            <Label>Questions Attempted:</Label>
            <Value>{questionsAttempted}</Value>
          </Info>
          <Info>
            <Label>Correct Answers:</Label>
            <Value>{correctAnswers}</Value>
          </Info>
          <Info>
            <Label>Incorrect Answers:</Label>
            <Value>{incorrectAnswers}</Value>
          </Info>
          <Info>
            <Label>Accuracy:</Label>
            <Value>{accuracy}%</Value>
          </Info>
        </DetailsCard>
        <ButtonGroup>
          <Button onClick={handleDownloadPDF}>Download PDF</Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;
  max-width: 800px;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #4CAF50;
  border-radius: 50%;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #4CAF50;
  transition: all 0.3s ease;

  &:hover {
    background: #4CAF50;
    color: #fff;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  margin-left: 20px;
  color: #4CAF50;
  flex: 1;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
`;

const DetailsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Subtitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Info = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
`;

const Value = styled.div`
  font-size: 18px;
  color: #666;
`;

const ChartContainer = styled.div`
  max-width: 400px;
  margin: 0 auto 20px auto;
`;

const ButtonGroup = styled.div`
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

export default Profile;
