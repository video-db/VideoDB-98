import React from 'react';
import styled from 'styled-components';
import Icon from '../common/Icon';
import { ICONS } from '../../assets/icons';
import { useAppContext } from '../../contexts/AppContext';
import FolderContent from './FolderContent';
import type { FileItem } from '../../types';

const ComputerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: white;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: #c0c0c0;
  border-bottom: 1px solid #808080;
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: #c0c0c0;
  border-bottom: 1px solid #808080;
  
  .address-label {
    font-weight: bold;
    margin-right: 8px;
  }
  
  .address-content {
    flex-grow: 1;
    background-color: white;
    border: 1px solid #808080;
    padding: 2px 5px;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 15px;
  padding: 20px;
  flex-grow: 1;
  overflow: auto;
`;

const StatusBar = styled.div`
  padding: 5px 8px;
  background-color: #c0c0c0;
  font-size: 12px;
  border-top: 1px solid #808080;
`;

const MyComputer = () => {
  const { openWindow } = useAppContext();
  
  // Mock folders for the demo
  const folders: FileItem[] = [
    { id: 'videos', name: 'Videos', icon: ICONS.FILE_TYPES.FOLDER, type: 'folder' as const },
    { id: 'audios', name: 'Audio', icon: ICONS.FILE_TYPES.FOLDER, type: 'folder' as const },
    { id: 'images', name: 'Images', icon: ICONS.FILE_TYPES.FOLDER, type: 'folder' as const },
  ];
  
  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      // Open a new window for this folder
      openWindow(
        `folder-${item.id}`,
        'file-explorer',
        item.name,
        <FolderContent type={item.id} path={`My Computer / ${item.name}`} />,
        {
          icon: ICONS.FILE_TYPES.FOLDER_OPEN,
          size: { width: 720, height: 480 }
        }
      );
    }
  };

  return (
    <ComputerContainer>
      <Toolbar>
        <span>My Computer</span>
      </Toolbar>
      <AddressBar>
        <span className="address-label">Address:</span>
        <div className="address-content">My Computer</div>
      </AddressBar>
      
      <Content>
        {folders.map((folder) => (
          <Icon 
            key={folder.id}
            src={folder.icon || ICONS.FILE_TYPES.FOLDER}
            label={folder.name}
            size="48px"
            onClick={() => {}}
            onDoubleClick={() => handleItemDoubleClick(folder)}
          />
        ))}
      </Content>
      
      <StatusBar>
        3 objects
      </StatusBar>
    </ComputerContainer>
  );
};

export default MyComputer;