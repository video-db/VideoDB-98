import React from 'react';
import styled from 'styled-components';

const StyledMenuItem = styled.div`
  padding: 3px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  
  &:hover {
    background-color: #000080;
    color: white;
  }
  
  &.separator {
    height: 1px;
    margin: 4px 2px;
    background-color: #808080;
    pointer-events: none;
    padding: 0;
  }
  
  &.disabled {
    color: #808080;
    pointer-events: none;
  }
  
  img {
    width: 16px;
    height: 16px;
  }
`;

const MenuItem = ({ icon, children, separator, disabled, onClick }) => {
  if (separator) {
    return <StyledMenuItem className="separator" />;
  }
  
  return (
    <StyledMenuItem 
      className={disabled ? 'disabled' : ''}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <img src={icon} alt="" />}
      {children}
    </StyledMenuItem>
  );
};

export default MenuItem;