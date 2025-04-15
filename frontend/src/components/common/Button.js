import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 5px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  img {
    max-width: 16px;
    max-height: 16px;
  }
`;

const Button = ({ children, icon, className, ...props }) => {
  return (
    <StyledButton className={`${className || ''}`} {...props}>
      {icon && <img src={icon} alt="" />}
      {children}
    </StyledButton>
  );
};

export default Button;