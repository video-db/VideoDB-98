import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { ICONS } from '../../assets/icons';
import { DialogProps } from '../../types';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const DialogWindow = styled.div`
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  min-width: 300px;
  max-width: 500px;
`;

const DialogHeader = styled.div`
  background-color: #000080;
  color: white;
  padding: 3px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title {
    font-weight: bold;
    font-size: 14px;
  }
  
  .close {
    width: 16px;
    height: 16px;
    background: #c0c0c0;
    border: 1px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:active {
      border-color: #808080 #ffffff #ffffff #808080;
    }
    
    img {
      width: 10px;
      height: 10px;
    }
  }
`;

const DialogContent = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 16px;
    
    img {
      width: 32px;
      height: 32px;
    }
  }
  
  .message {
    flex-grow: 1;
  }
`;

const DialogFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Dialog: React.FC<DialogProps> = ({
  title = 'Windows Media Explorer',
  message,
  icon = ICONS.MISC.INFO,
  isOpen,
  onClose,
  buttons = [{ label: 'OK', onClick: onClose }]
}) => {
  if (!isOpen) return null;
  
  return (
    <DialogOverlay onClick={onClose}>
      <DialogWindow onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <DialogHeader>
          <div className="title">{title}</div>
          <div className="close" onClick={onClose}>
            <span>✕</span>
          </div>
        </DialogHeader>
        <DialogContent>
          <div className="icon">
            <img src={icon} alt="" />
          </div>
          <div className="message">{message}</div>
        </DialogContent>
        <DialogFooter>
          {buttons.map((button, index) => (
            <Button key={index} onClick={button.onClick || onClose}>
              {button.label}
            </Button>
          ))}
        </DialogFooter>
      </DialogWindow>
    </DialogOverlay>
  );
};

export default Dialog;