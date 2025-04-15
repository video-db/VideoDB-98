import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import Icon from '../common/Icon';
import WindowManager from '../Window/WindowManager';
import TaskbarItem from './TaskbarItem';
import { ICONS } from '../../assets/icons';
import { useAppContext } from '../../contexts/AppContext';
import { MyComputer } from '../FileExplorer';
import { WindowProps } from '../../types';

const DesktopContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #008080;
  overflow: hidden;
  
  /* Ensure all elements inside are clickable properly */
  * {
    box-sizing: border-box;
  }
`;

const DesktopIcons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
`;

const Taskbar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  background-color: #c0c0c0;
  border-top: 2px solid #ffffff;
  display: flex;
  align-items: center;
  padding: 0 4px;
  z-index: 9000;
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 8px;
  height: 28px;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  margin-right: 8px;
  cursor: pointer;
  outline: none;
  
  &:hover {
    background-color: #d0d0d0;
  }
  
  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
    background-color: #b8b8b8;
  }
  
  img {
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
  
  span {
    font-weight: bold;
    font-size: 14px;
  }
`;

const TaskbarItems = styled.div`
  display: flex;
  gap: 2px;
  flex-grow: 1;
  height: 28px;
  overflow-x: auto;
  overflow-y: hidden;
  
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

// Style override for context menu
const MenuStyles = styled.div`
  .react-contexify {
    background-color: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    padding: 2px;
    z-index: 9999;
  }
  
  .react-contexify__item {
    padding: 0;
    margin: 0;
  }
  
  .react-contexify__item__content {
    padding: 3px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: black;
    font-family: 'MS Sans Serif', sans-serif;
    
    &:hover {
      background-color: #000080;
      color: white;
    }
    
    img {
      width: 16px;
      height: 16px;
    }
  }
  
  .react-contexify__separator {
    height: 1px;
    margin: 4px 2px;
    background-color: #808080;
  }
`;

const WelcomeMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  background-color: rgba(255, 255, 255, 0.95);
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  width: 450px;
  z-index: 900;
  
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #000080;
  }
  
  p {
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .hint {
    font-style: italic;
    color: #444;
    margin-top: 20px;
    font-size: 12px;
  }
`;

const WelcomeButton = styled.button`
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #d0d0d0;
  }
  
  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
    background-color: #b0b0b0;
  }
`;

const DESKTOP_MENU_ID = 'desktop-context-menu';

const Desktop: React.FC = () => {
  const { show } = useContextMenu({
    id: DESKTOP_MENU_ID,
  });
  
  const { 
    windows, 
    activeWindowId, 
    openWindow, 
    focusWindow, 
    minimizeWindow,
    fetchVideos,
    fetchAudios,
    fetchImages 
  } = useAppContext();
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (show) {
      show({ event: e });
    }
  };
  
  const handleIconClick = (iconId: string) => {
    setSelectedIcon(iconId);
  };
  
  const handleTaskItemClick = (windowId: string) => {
    const window = windows.find((w: WindowProps) => w.id === windowId);
    if (window?.isMinimized) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };
  
  const handleOpenMyComputer = () => {
    openWindow(
      'my-computer',
      'my-computer',
      'My Computer',
      <MyComputer />,
      {
        icon: ICONS.DESKTOP.MY_COMPUTER,
        size: { width: 800, height: 600 }
      }
    );
    setShowWelcome(false);
  };
  
  const handleRefresh = () => {
    fetchVideos();
    fetchAudios();
    fetchImages();
  };
  
  return (
    <DesktopContainer onContextMenu={handleContextMenu}>
      <DesktopIcons>
        <Icon
          src={ICONS.DESKTOP.MY_COMPUTER}
          label="My Computer"
          size="48px"
          onClick={() => handleIconClick('my-computer')}
          onDoubleClick={handleOpenMyComputer}
          selected={selectedIcon === 'my-computer'}
          textColor="white"
          onContextMenu={() => {}}
        />
      </DesktopIcons>
      
      {showWelcome && (
        <WelcomeMessage>
          <h1>Windows Media Explorer</h1>
          <p>Welcome to the Windows 95/98 style Media Explorer application!</p>
          <p>This app lets you browse, manage, and interact with video content through a nostalgic interface, powered by VideoDB.</p>
          <p>Click the button below or double-click on the "My Computer" icon to get started.</p>
          <WelcomeButton onClick={handleOpenMyComputer}>Open My Computer</WelcomeButton>
          <div className="hint">(You can also explore the README.txt file for more information)</div>
        </WelcomeMessage>
      )}
      
      <WindowManager />
      
      <Taskbar>
        <StartButton>
          <img 
            src="https://win98icons.alexmeub.com/icons/png/windows-0.png" 
            alt="Start"
          />
          <span>Start</span>
        </StartButton>
        
        <TaskbarItems>
          {windows.map((window: WindowProps) => (
            <TaskbarItem
              key={window.id}
              icon={window.icon}
              title={window.title}
              active={activeWindowId === window.id && !window.isMinimized}
              onClick={() => handleTaskItemClick(window.id)}
            />
          ))}
        </TaskbarItems>
      </Taskbar>
      
      {/* Context Menu */}
      <MenuStyles>
        <Menu id={DESKTOP_MENU_ID} animation={false}>
          <Item onClick={handleOpenMyComputer}>
            <img src={ICONS.DESKTOP.MY_COMPUTER} alt="" />
            Open My Computer
          </Item>
          <Separator />
          <Item onClick={handleRefresh}>
            <img src={ICONS.MISC.SETTINGS} alt="" />
            Refresh
          </Item>
          <Item onClick={() => {}}>
            <img src={ICONS.MISC.SETTINGS} alt="" />
            Properties
          </Item>
        </Menu>
      </MenuStyles>
    </DesktopContainer>
  );
};

export default Desktop;