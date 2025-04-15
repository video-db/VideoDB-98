import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import styled from 'styled-components';
import IconRenderer from '../common/IconRenderer';
import { ICONS } from '../../assets/icons';

// Override styles for react-contexify
const ContextMenuStyles = styled.div`
  /* Style overrides for react-contexify library */
  .react-contexify {
    background-color: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    padding: 2px;
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

// Desktop context menu (right-click on desktop)
export const DesktopContextMenu = ({ onRefresh, onViewOptions }) => {
  return (
    <ContextMenuStyles>
      <Menu id="desktop-context-menu" animation={false}>
        <Item onClick={onViewOptions}>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          View
        </Item>
        <Item onClick={onRefresh}>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          Refresh
        </Item>
        <Separator />
        <Item>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          Properties
        </Item>
      </Menu>
    </ContextMenuStyles>
  );
};

// File Explorer context menu (right-click in empty space)
export const FileExplorerContextMenu = ({ onAddNewFile, onViewOptions, onRefresh }) => {
  return (
    <ContextMenuStyles>
      <Menu id="file-explorer-context-menu" animation={false}>
        <Item onClick={onAddNewFile}>
          <IconRenderer icon={ICONS.FILE_TYPES.UNKNOWN} style={{ width: 16, height: 16 }} />
          Add New File
        </Item>
        <Separator />
        <Item onClick={onViewOptions}>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          View
        </Item>
        <Item onClick={onRefresh}>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          Refresh
        </Item>
      </Menu>
    </ContextMenuStyles>
  );
};

// Media item context menu (right-click on a media file)
export const MediaItemContextMenu = ({ onOpen, onRename, onDelete }) => {
  return (
    <ContextMenuStyles>
      <Menu id="media-item-context-menu" animation={false}>
        <Item onClick={onOpen}>
          <IconRenderer icon={ICONS.CONTROLS.PLAY} style={{ width: 16, height: 16 }} />
          Open
        </Item>
        <Separator />
        <Item onClick={onRename}>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          Rename
        </Item>
        <Item onClick={onDelete}>
          <IconRenderer icon={ICONS.MISC.ERROR} style={{ width: 16, height: 16 }} />
          Delete
        </Item>
      </Menu>
    </ContextMenuStyles>
  );
};

// Folder context menu (right-click on a folder)
export const FolderContextMenu = ({ onOpen }) => {
  return (
    <ContextMenuStyles>
      <Menu id="folder-context-menu" animation={false}>
        <Item onClick={onOpen}>
          <IconRenderer icon={ICONS.FILE_TYPES.FOLDER_OPEN} style={{ width: 16, height: 16 }} />
          Open
        </Item>
        <Separator />
        <Item disabled>
          <IconRenderer icon={ICONS.MISC.SETTINGS} style={{ width: 16, height: 16 }} />
          Properties
        </Item>
      </Menu>
    </ContextMenuStyles>
  );
};

const ContextMenu = ({ items, onItemClick }) => {
  return (
    <MenuContainer>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.separator ? (
            <Separator />
          ) : (
            <MenuItem 
              onClick={() => onItemClick(item.id)}
              disabled={item.disabled}
            >
              {item.icon && (
                <IconRenderer icon={item.icon} style={{ width: 16, height: 16 }} />
              )}
              {item.label}
            </MenuItem>
          )}
        </React.Fragment>
      ))}
    </MenuContainer>
  );
};

export default ContextMenu;