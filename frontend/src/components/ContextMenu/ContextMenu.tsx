import React from 'react';
import styled from 'styled-components';
import { ContextMenuProps } from '../../types';

const MenuContainer = styled.div`
  position: fixed;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 2px;
  z-index: 9999;
`;

const MenuItem = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 20px;
  width: 100%;
  background: none;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  color: black;
  font-family: 'MS Sans Serif', sans-serif;
  text-align: left;
  
  &:hover:not(:disabled) {
    background-color: #000080;
    color: white;
  }
  
  img {
    width: 16px;
    height: 16px;
  }
`;

const Separator = styled.div`
  height: 1px;
  margin: 4px 2px;
  background-color: #808080;
`;

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const handleItemClick = (onClick: () => void) => {
    onClick();
    onClose();
  };

  return (
    <MenuContainer style={{ top: y, left: x }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.separator ? (
            <Separator />
          ) : (
            <MenuItem 
              onClick={() => handleItemClick(item.onClick)}
              disabled={item.disabled}
            >
              {item.icon && <img src={item.icon} alt="" />}
              {item.label}
            </MenuItem>
          )}
        </React.Fragment>
      ))}
    </MenuContainer>
  );
};

export default ContextMenu; 