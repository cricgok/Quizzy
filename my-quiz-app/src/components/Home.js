import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBook, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import InstructionModal from './Instructions';

const Home = ({ isLoggedIn, handleLogout }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://quizzy-1-02jo.onrender.com/quizzes')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
      });
  }, []);

  const handleSolveQuiz = (tableName) => {
    if (isLoggedIn) {
      setSelectedQuiz(tableName);
      setShowModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProceed = () => {
    setShowModal(false);
    navigate(`/quiz/${selectedQuiz}`);
  };

  return (
    <Container>
      <Sidebar>
        <LogoContainer>
          <FaBook size={48} color="#6c63ff" />
          <Logo>Øendo</Logo>
        </LogoContainer>
        <MenuItem>
          <StyledLink to="/">Tests</StyledLink>
        </MenuItem>
        {isLoggedIn ? (
          <>
            <MenuItem>
              <FaUser size={18} />
              <StyledLink to="/profile">Profile</StyledLink>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <FaSignOutAlt size={18} />
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>
              <FaSignInAlt size={18} />
              <StyledLink to="/login">Login</StyledLink>
            </MenuItem>
            <MenuItem>
              <FaUserPlus size={18} />
              <StyledLink to="/register">Register</StyledLink>
            </MenuItem>
          </>
        )}
      </Sidebar>
      <MainContent>
        <TitleContainer>
          <Title>Quizzes for you!</Title>
        </TitleContainer>
        <QuizList>
          {quizzes.map((quiz, index) => (
            <QuizItem key={index}>
              <QuizTitle>{quiz.tableName}</QuizTitle>
              <QuizDetails>Total Questions: {quiz.count} | Total Points: {quiz.count * 5}</QuizDetails>
              <SolveButton onClick={() => handleSolveQuiz(quiz.tableName)}>Solve Challenge</SolveButton>
            </QuizItem>
          ))}
        </QuizList>
      </MainContent>
      <InstructionModal show={showModal} onClose={handleCloseModal} onProceed={handleProceed} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    width: 240px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.h1`
  font-size: 24px;
  color: #6c63ff;
  margin-top: 10px;
`;

const MenuItem = styled.div`
  font-size: 18px;
  color: #333;
  margin: 20px 0;
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin-left: 8px;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const TitleContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const QuizList = styled.div``;

const QuizItem = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const QuizTitle = styled.h3`
  font-size: 20px;
  margin: 0;
`;

const QuizDetails = styled.p`
  font-size: 16px;
  color: #777;
`;

const SolveButton = styled.button`
  padding: 10px 20px;
  background-color: #ffc107;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

export default Home;
