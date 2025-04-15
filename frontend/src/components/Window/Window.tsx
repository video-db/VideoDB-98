import React from 'react';
import styled from 'styled-components';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ICONS } from '../../assets/icons';
import { useAppContext } from '../../contexts/AppContext';
import { WindowProps } from '../../types';

interface StyledWindowProps {
  $isMaximized: boolean;
  $width: string;
  $height: string;
  $zIndex: number;
  $position?: { x: number; y: number };
  $transform?: string;
}

const StyledWindow = styled.div<StyledWindowProps>`
  position: absolute;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  z-index: ${props => props.$zIndex || 1};
  width: ${props => props.$isMaximized ? '100%' : props.$width || '640px'};
  height: ${props => props.$isMaximized ? '100%' : props.$height || '480px'};
  transform: ${props => props.$transform || 'translate3d(0, 0, 0)'};
  
  // Position only matters when not maximized
  ${props => !props.$isMaximized && `
    top: ${props.$position?.y || 0}px;
    left: ${props.$position?.x || 0}px;
  `}
  
  // When maximized, take full window space
  ${props => props.$isMaximized && `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-width: 0px;
  `}
  
  &.active {
    z-index: ${props => props.$zIndex || 100};
    
    .window-header {
      background-color: #000080;
      color: white;
    }
  }
  
  &.minimized {
    display: none;
  }
`;

const WindowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #808080;
  padding: 3px 2px 3px 3px;
  cursor: move;
  user-select: none;
  
  .title {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: 2px;
    
    img {
      width: 16px;
      height: 16px;
    }
    
    span {
      font-weight: bold;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
  }
  
  .controls {
    display: flex;
    gap: 2px;
  }
`;

const WindowButton = styled.button`
  width: 16px;
  height: 16px;
  background-color: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  
  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
  }
  
  img {
    width: 12px;
    height: 12px;
  }
  
  span {
    font-size: 10px;
    line-height: 1;
  }
`;

const WindowContent = styled.div<{ $padding?: string }>`
  flex-grow: 1;
  overflow: auto;
  padding: ${props => props.$padding || '0px'};
  position: relative;
  background-color: #ffffff;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  margin: 0 4px 4px 4px;
`;

const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  children,
  defaultPosition = { x: 50, y: 50 },
  defaultSize = { width: 640, height: 480 },
  resizable = true,
  minimizable = true,
  maximizable = true,
  closable = true,
  isMinimized = false,
  isMaximized = false,
  zIndex = 1,
  padding = '8px',
  onClose
}) => {
  const { activeWindowId, focusWindow, minimizeWindow, maximizeWindow, closeWindow } = useAppContext();
  
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `window-${id}`,
    disabled: isMaximized,
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeWindow(id);
    }
  };
  
  const handleMinimize = () => {
    minimizeWindow(id);
  };
  
  const handleMaximize = () => {
    maximizeWindow(id);
  };
  
  const handleClickWindow = () => {
    focusWindow(id);
  };
  
  const isActive = activeWindowId === id;
  
  return (
    <StyledWindow
      ref={setNodeRef}
      className={`${isActive ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`}
      onClick={handleClickWindow}
      $isMaximized={isMaximized}
      $width={defaultSize.width + 'px'}
      $height={defaultSize.height + 'px'}
      $zIndex={zIndex}
      $position={defaultPosition}
      $transform={style.transform}
    >
      <WindowHeader className="window-header" {...attributes} {...listeners}>
        <div className="title">
          {icon && <img src={icon} alt="" />}
          <span>{title}</span>
        </div>
        <div className="controls">
          {minimizable && (
            <WindowButton onClick={handleMinimize}>
              <img src={ICONS.WINDOW.MINIMIZE} alt="Minimize" />
            </WindowButton>
          )}
          {maximizable && (
            <WindowButton onClick={handleMaximize}>
              <img
                src={isMaximized ? ICONS.WINDOW.RESTORE : ICONS.WINDOW.MAXIMIZE}
                alt={isMaximized ? "Restore" : "Maximize"}
              />
            </WindowButton>
          )}
          {closable && (
            <WindowButton onClick={handleClose}>
              <img src={ICONS.WINDOW.CLOSE} alt="Close" />
            </WindowButton>
          )}
        </div>
      </WindowHeader>
      <WindowContent $padding={padding}>
        {children}
      </WindowContent>
    </StyledWindow>
  );
};

export default Window;