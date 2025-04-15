import React from 'react';
import styled from 'styled-components';
import { TaskbarItemProps } from '../../types';

const StyledTaskbarItem = styled.div<TaskbarItemProps>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  min-width: 150px;
  max-width: 200px;
  height: 100%;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: ${props => props.$active ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff'};
  cursor: pointer;
  
  img {
    width: 16px;
    height: 16px;
  }
  
  span {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface TaskbarItemComponentProps {
  icon?: string;
  title: string;
  active: boolean;
  onClick: () => void;
}

const TaskbarItem: React.FC<TaskbarItemComponentProps> = ({
  icon,
  title,
  active,
  onClick
}) => {
  return (
    <StyledTaskbarItem
      $active={active}
      onClick={onClick}
    >
      {icon && <img src={icon} alt="" />}
      <span>{title}</span>
    </StyledTaskbarItem>
  );
};

export default TaskbarItem; 