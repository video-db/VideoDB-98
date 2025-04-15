import React from 'react';
import styled from 'styled-components';
import { ICONS } from '../../assets/icons';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  title?: string;
}

const StyledButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 8px;
  height: 24px;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background-color: #d0d0d0;
  }
  
  &:active:not(:disabled) {
    border-color: #808080 #ffffff #ffffff #808080;
    background-color: #b8b8b8;
  }
  
  img {
    width: 16px;
    height: 16px;
  }
  
  span {
    font-size: 12px;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  icon = ICONS.MISC.INFO,
  className = 'dialog-button',
  disabled = false,
  style,
  title
}) => {
  return (
    <StyledButton
      onClick={onClick}
      className={className}
      $disabled={disabled}
      disabled={disabled}
      style={style}
      title={title}
    >
      {icon && <img src={icon} alt="" />}
      <span>{children}</span>
    </StyledButton>
  );
};

export default Button; 