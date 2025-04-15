import React from 'react';
import styled from 'styled-components';
import { IconProps, IconPropsStyled } from '../../types';

const IconWrapper = styled.div<IconPropsStyled>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${props => props.$size || '64px'};
  padding: 4px;
  cursor: pointer;
  user-select: none;
  
  &.selected {
    background-color: #000080;
    color: white;
  }
  
  img {
    width: ${props => props.$size || '64px'};
    height: ${props => props.$size || '64px'};
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 12px;
    text-align: center;
    word-break: break-word;
    color: ${props => props.$textColor || 'black'};
  }
`;

const Icon: React.FC<IconProps> = ({
  src,
  label,
  size,
  onClick,
  onDoubleClick,
  onContextMenu,
  selected,
  textColor
}) => {
  // Simple handlers that prevent event propagation
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e as React.MouseEvent<HTMLDivElement, MouseEvent>);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (onDoubleClick) {
      onDoubleClick(e as React.MouseEvent<HTMLDivElement, MouseEvent>);
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
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