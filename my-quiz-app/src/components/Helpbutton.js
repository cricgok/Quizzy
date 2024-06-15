import React from 'react';
import styled from 'styled-components';
import { FaQuestionCircle } from 'react-icons/fa';

const HelpButton = ({ onClick }) => {
  return (
    <StyledHelpButton onClick={onClick}>
      <FaQuestionCircle size={24} />
    </StyledHelpButton>
  );
};

const StyledHelpButton = styled.button`
  background-color: #6c63ff;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5548c8;
  }
`;

export default HelpButton;
