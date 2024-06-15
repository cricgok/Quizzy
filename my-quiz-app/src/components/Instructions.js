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
`;

const Modal = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 700px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #3b5998;
  padding-bottom: 15px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  color: #3b5998;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 15px 0;
`;

const InstructionsTitle = styled.p`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const InstructionsText = styled.p`
  font-size: 20px;
  margin-bottom: 15px;
`;

const InstructionItem = styled.li`
  margin-bottom: 12px;
  font-size: 18px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 2px solid #3b5998;
`;

const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  input {
    margin-right: 10px;
  }
`;

const TermsCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ProceedButton = styled.button`
  padding: 15px 25px;
  background-color: #4CAF50;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  &:hover:enabled {
    background-color: #45a049;
  }
`;

export default InstructionModal;
