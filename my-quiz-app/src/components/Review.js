import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const {
    questions = [],
    selectedOptions = {},
  } = location.state || {};

  const handleSubmit = () => {
    navigate('/results', { state: location.state });
  };

  const handleBackToQuiz = () => {
    navigate(`/quiz/${location.state.tableName}`, { state: location.state });
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  if (!questions.length) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Container>
      <Header>
        <Title>Review Your Answers</Title>
      </Header>
      <Legend>
        <LegendItem>
          <LegendCircle color="#4CAF50" />
          Answered
        </LegendItem>
        <LegendItem>
          <LegendCircle color="#ccc" />
          Unanswered
        </LegendItem>
      </Legend>
      <Content>
        <QuestionList>
          {questions.map((question, index) => (
            <QuestionItem key={index}>
              <QuestionCircle
                answered={selectedOptions[index] !== undefined}
                onClick={() => toggleQuestion(index)}
              >
                {index + 1}
              </QuestionCircle>
              {expandedQuestion === index && (
                <QuestionDetails>
                  <QuestionText>{question.question_text}</QuestionText>
                  <Options>
                    {[question.option1, question.option2, question.option3].map((option, i) => (
                      <Option key={i} selected={selectedOptions[index] === `option${i + 1}`}>
                        {option}
                      </Option>
                    ))}
                  </Options>
                </QuestionDetails>
              )}
            </QuestionItem>
          ))}
        </QuestionList>
      </Content>
      <Footer>
        <FooterButton onClick={handleBackToQuiz}>Back to Quiz</FooterButton>
        <FooterButton onClick={handleSubmit}>Submit</FooterButton>
      </Footer>
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
  padding: 40px;
  background-color: #f0f2f5;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 36px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const LegendCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ color }) => color};

  @media (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const QuestionList = styled.div`
  width: 100%;
  max-width: 800px;
`;

const QuestionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ answered }) => (answered ? '#4CAF50' : '#ccc')};
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
`;

const QuestionDetails = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const QuestionText = styled.div`
  font-size: 18px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Option = styled.div`
  padding: 10px;
  background-color: ${({ selected }) => (selected ? '#4CAF50' : '#fff')};
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 18px;
  color: ${({ selected }) => (selected ? '#fff' : '#000')};

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 16px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
`;

const FooterButton = styled.button`
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

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 16px;
    width: 100%;
  }
`;

export default Review;
