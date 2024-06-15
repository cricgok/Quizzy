import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import HelpButton from './Helpbutton';
import HelpModal from './Help';

const Quiz = ({ user, setUser }) => {
  const { tableName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(location.state?.selectedOptions || {});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    axios.get(`https://quizzy-1-02jo.onrender.com/quizzes/${tableName}`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error.response ? error.response.data : error.message);
      });
  }, [tableName]);

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <Loading>Loading...</Loading>;
  }

  const handleOptionChange = (e, option) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] !== undefined) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questions.forEach((question, index) => {
      const selectedOption = selectedOptions[index];
      if (selectedOption !== undefined) {
        if (selectedOption === `option${question.correct_option}`) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });

    return { correctAnswers, incorrectAnswers, attemptedQuestions: Object.keys(selectedOptions).length };
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleEndTest = () => {
    const { correctAnswers, incorrectAnswers, attemptedQuestions } = calculateResults();
    const allQuestionsAnswered = questions.length === Object.keys(selectedOptions).length;
    const message = allQuestionsAnswered
      ? 'All questions are answered. Do you want to review your answers?'
      : 'Not all questions are answered. Do you want to review your answers before submitting?';

    if (window.confirm(message)) {
      navigate('/review', {
        state: {
          questions,
          selectedOptions,
          tableName,
          totalQuestions: questions.length,
          correctAnswers,
          incorrectAnswers,
          attemptedQuestions,
          skippedQuestions: questions.length - Object.keys(selectedOptions).length
        }
      });
    }
  };

  const handleBackClick = () => {
    const { correctAnswers, incorrectAnswers, attemptedQuestions } = calculateResults();
    if (window.confirm('Warning: The test will be auto-submitted. Do you want to proceed?')) {
      navigate('/review', {
        state: {
          questions,
          selectedOptions,
          tableName,
          totalQuestions: questions.length,
          correctAnswers,
          incorrectAnswers,
          attemptedQuestions,
          skippedQuestions: questions.length - Object.keys(selectedOptions).length
        }
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHelpClose = () => {
    setShowHelp(false);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBackClick}>←</BackButton>
          <MenuIcon onClick={toggleMenu}>☰</MenuIcon>
        </HeaderLeft>
        <ButtonGroup>
          <EndRoundButton onClick={handleEndTest}>End Test</EndRoundButton>
          <HelpButton onClick={() => setShowHelp(true)} /> 
        </ButtonGroup>
      </Header>
      <Content>
        {isMenuOpen && (
          <Sidebar>
            <SidebarContent>
              <MenuList>
                {questions.map((question, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setIsMenuOpen(false);
                    }}
                  >
                    <QuestionLabel>
                      MCQ {index + 1}
                    </QuestionLabel>
                    <QuestionPoints>5 Points</QuestionPoints>
                    <QuestionStatus answered={selectedOptions[index] !== undefined}>
                      <input type="radio" checked={selectedOptions[index] !== undefined} readOnly />
                    </QuestionStatus>
                  </MenuItem>
                ))}
              </MenuList>
            </SidebarContent>
          </Sidebar>
        )}
        <MainContent isMenuOpen={isMenuOpen}>
          <LeftPanel>
            <QuestionNumber>Question {currentQuestionIndex + 1}</QuestionNumber>
            <QuestionText>{currentQuestion.question_text}</QuestionText>
          </LeftPanel>
          <Divider />
          <RightPanel>
            <QuestionHeader>Select One Of The Following Options:</QuestionHeader>
            <Options>
              <Option onClick={(e) => handleOptionChange(e, 'option1')} selected={selectedOptions[currentQuestionIndex] === 'option1'}>
                <input type="radio" name="option" id="option1" value="option1" onChange={(e) => handleOptionChange(e, 'option1')} checked={selectedOptions[currentQuestionIndex] === 'option1'} />
                <Label htmlFor="option1">{currentQuestion.option1}</Label>
              </Option>
              <Option onClick={(e) => handleOptionChange(e, 'option2')} selected={selectedOptions[currentQuestionIndex] === 'option2'}>
                <input type="radio" name="option" id="option2" value="option2" onChange={(e) => handleOptionChange(e, 'option2')} checked={selectedOptions[currentQuestionIndex] === 'option2'} />
                <Label htmlFor="option2">{currentQuestion.option2}</Label>
              </Option>
              <Option onClick={(e) => handleOptionChange(e, 'option3')} selected={selectedOptions[currentQuestionIndex] === 'option3'}>
                <input type="radio" name="option" id="option3" value="option3" onChange={(e) => handleOptionChange(e, 'option3')} checked={selectedOptions[currentQuestionIndex] === 'option3'} />
                <Label htmlFor="option3">{currentQuestion.option3}</Label>
              </Option>
            </Options>
          </RightPanel>
        </MainContent>
      </Content>
      <Footer>
        <FooterButton onClick={() => setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0))}>← Previous</FooterButton>
        <FooterButton onClick={handleSkipQuestion}>Skip</FooterButton>
        {currentQuestionIndex < questions.length - 1 ? (
          <FooterButton onClick={handleNextQuestion}>Save & Next →</FooterButton>
        ) : (
          <FooterButton onClick={handleEndTest}>Review & Submit</FooterButton>
        )}
      </Footer>
      {showHelp && <HelpModal show={showHelp} onClose={handleHelpClose} />} {/* Add HelpModal */}
    </Container>
  );
};

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background-color: #ccc;
  border: none;
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  padding: 15px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #6c63ff;
    color: white;
  }
`;

const MenuIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
`;

const EndRoundButton = styled.button`
  padding: 15px 30px;
  background-color: lightgray;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: black;
  font-size: 16px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #6c63ff;
    color: white;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #fff;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
  position: absolute;
  height: 100%;
  z-index: 1000;
  border-radius: 20px;

  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    height: auto;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    overflow-y: visible;
  }
`;

const MenuItem = styled.li`
  padding: 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  &:hover {
    background-color: #f0f2f5;
  }
`;

const QuestionStatus = styled.div`
  display: flex;
  align-items: center;

  input {
    cursor: pointer;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${({ answered }) => (answered ? 'green' : 'white')};
    border: 1px solid ${({ answered }) => (answered ? 'green' : 'black')};
  }
`;

const QuestionLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const QuestionPoints = styled.div`
  font-size: 12px;
  color: gray;
  margin-right: 10px;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  margin-left: ${({ isMenuOpen }) => (isMenuOpen ? '240px' : '0')};

  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 0;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 5px;
  font-size: 16.5px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const Divider = styled.div`
  width: 10px;
  background-color: #ccc;
  height: 100%;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100%;
    height: 10px;
    margin: 20px 0;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16.5px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const QuestionNumber = styled.h3`
  font-size: 28.5px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const QuestionText = styled.p`
  font-size: 28.5px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const QuestionHeader = styled.h2`
  font-size: 24.5px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Option = styled.div`
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#e6e6ff' : '#fff')};
  transition: all 0.3s ease;
  &:hover {
    border-color: #6c63ff;
    background-color: #f0f2f5;
  }
`;

const Label = styled.label`
  margin-left: 10px;
  font-size: 24.5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
  border-radius: 15px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FooterButton = styled.button`
  padding: 15px 30px;
  background-color: #ccc;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;

  &:nth-of-type(1) {
    background-color: lightgray;
    color: black;
    font-size: 16px;
  }

  &:nth-of-type(2) {
    background-color: lightgray;
    color: black;
    font-size: 16px;
  }

  &:hover {
    background-color: #6c63ff;
    color: white;
  }

  &:nth-of-type(3) {
    background-color: lightgray;
    color: black;
    font-size: 16px;

    &:hover {
      background-color: #6c63ff;
      color: white;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default Quiz;
