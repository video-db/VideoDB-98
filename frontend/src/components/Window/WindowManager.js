import React from 'react';
import styled from 'styled-components';
import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useAppContext } from '../../contexts/AppContext';
import Window from './Window.tsx';

const WindowManagerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 37px; // Space for taskbar
  overflow: hidden;
  pointer-events: none; // Allow clicking through the container to desktop
  
  & > * {
    pointer-events: auto; // Re-enable pointer events for children (windows)
  }
`;

const WindowManager = () => {
  const { windows, updateWindowPosition } = useAppContext();
  
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  
  const sensors = useSensors(mouseSensor);

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const windowId = active.id.replace('window-', '');
    const window = windows.find(w => w.id === windowId);
    
    if (window && !window.isMaximized) {
      const newPosition = {
        x: (window.position?.x || 0) + delta.x,
        y: (window.position?.y || 0) + delta.y,
      };
      updateWindowPosition(windowId, newPosition);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <WindowManagerContainer>
        {windows.map((window) => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            defaultPosition={window.position}
            defaultSize={window.size}
            isMinimized={window.isMinimized}
            isMaximized={window.isMaximized}
            zIndex={window.zIndex}
          >
            {window.content}
          </Window>
        ))}
      </WindowManagerContainer>
    </DndContext>
  );
};

export default WindowManager;