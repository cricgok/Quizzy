import React, { useState } from 'react';
import styled from 'styled-components';

const InstructionModal = ({ show, onClose, onProceed }) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!show) return null;

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Overlay>
      <Modal>
        <ModalHeader>
          <Title>Auto Test Disclaimer</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <InstructionsTitle>Online Knowledge Test Rules:</InstructionsTitle>
          <InstructionsText>During the test, the applicant must not:</InstructionsText>
          <ul>
            <InstructionItem>1. Ask for help answering any test questions.</InstructionItem>
            <InstructionItem>2. Have any electronic or recording devices in their possession.</InstructionItem>
            <InstructionItem>3. Have any notes or written reference material.</InstructionItem>
          </ul>
        </ModalBody>
        <ModalFooter>
          <TermsLabel>
            <TermsCheckbox 
              type="checkbox" 
              id="terms" 
              checked={isChecked} 
              onChange={handleCheckboxChange} 
            />
            <span>I accept the terms and conditions</span>
          </TermsLabel>
          <ProceedButton 
            onClick={onProceed} 
            disabled={!isChecked}
          >
            I Agree
          </ProceedButton>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #3b5998;
  padding-bottom: 10px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #3b5998;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;

  &:hover {
    color: #333;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 10px 0;

  @media (max-width: 480px) {
    padding: 8px 0;
  }
`;

const InstructionsTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const InstructionsText = styled.p`
  font-size: 18px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const InstructionItem = styled.li`
  margin-bottom: 8px;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 2px solid #3b5998;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const TermsCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ProceedButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: #45a049;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export default InstructionModal;
