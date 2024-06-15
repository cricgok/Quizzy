import React from 'react';
import styled from 'styled-components';

const HelpModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <Overlay>
      <Modal>
        <ModalHeader>
          <Title>Need Help?</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <InstructionsText>If you have any queries, please send an email to:</InstructionsText>
          <Email>gokulramesh033@gmail.com</Email>
        </ModalBody>
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
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #3b5998;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #3b5998;
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
`;

const ModalBody = styled.div`
  padding: 10px 0;
`;

const InstructionsText = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Email = styled.p`
  font-size: 20px;
  color: #3b5998;
  font-weight: bold;
`;

export default HelpModal;
