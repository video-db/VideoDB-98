import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  padding: 8px;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 2px;
  width: 90px;
  z-index: 1;
  
  &.selected {
    background-color: rgba(0, 0, 139, 0.4);
  }
  
  &:hover:not(.selected) {
    background-color: rgba(0, 0, 139, 0.2);
  }
  
  img {
    width: ${props => props.$size || '32px'};
    height: ${props => props.$size || '32px'};
    margin-bottom: 8px;
    pointer-events: none; /* Prevent image capturing click events */
    image-rendering: pixelated; /* For that authentic pixelated look */
  }
  
  .label {
    text-align: center;
    font-size: 12px;
    width: 100%;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${props => props.$textColor || '#000'};
    background-color: ${props => props.selected ? 'rgba(0, 0, 139, 0.4)' : 'transparent'};
    padding: 2px 4px;
    pointer-events: none; /* Prevent text capturing click events */
  }
`;

const Icon = ({ src, label, size, onClick, onDoubleClick, onContextMenu, selected, textColor }) => {
  // Simple handlers that prevent event propagation
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };
  
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e);
    }
  };
  
  return (
    <IconWrapper 
      $size={size}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      className={selected ? 'selected' : ''}
      $textColor={textColor}
    >
      <img src={src} alt={label} />
      <div className="label">{label}</div>
    </IconWrapper>
  );
};

export default Icon;