import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import Icon from '../common/Icon';
import Button from '../common/Button';
import Dialog from '../common/Dialog';
import Loading from '../common/Loading';
import { ICONS } from '../../assets/icons';
import { useAppContext } from '../../contexts/AppContext';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import { FileItem } from '../../types';

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const ExplorerToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background-color: #c0c0c0;
  border-bottom: 1px solid #808080;
`;

const ToolbarButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const ExplorerAddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #c0c0c0;
  border-bottom: 1px solid #808080;
  
  .label {
    margin-right: 8px;
    font-weight: bold;
  }
  
  .address {
    flex-grow: 1;
    background-color: white;
    border: 1px solid;
    border-color: #808080 #ffffff #ffffff #808080;
    padding: 2px 4px;
  }
`;

const ExplorerContent = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 5px;
  padding: 10px;
  overflow-y: auto;
  background-color: white;
`;

const ExplorerStatusBar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #c0c0c0;
  border-top: 1px solid #ffffff;
  font-size: 12px;
`;

// Define menu IDs
const EXPLORER_MENU_ID = 'file-explorer-context-menu';
const MEDIA_ITEM_MENU_ID = 'media-item-context-menu';
const FOLDER_MENU_ID = 'folder-context-menu';

// Style override for context menu
const MenuStyles = styled.div`
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

// Fix: Add FileExplorerProps interface
interface FileExplorerProps {
  type?: 'videos' | 'audios' | 'images' | 'root'; // Add 'root' type
  path?: string;
  onItemDoubleClick?: (item: FileItem) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  type = 'videos',
  path = 'My Computer',
  onItemDoubleClick
}) => {
  const { show: showExplorerMenu } = useContextMenu({ id: EXPLORER_MENU_ID });
  const { show: showMediaMenu } = useContextMenu({ id: MEDIA_ITEM_MENU_ID });
  const { show: showFolderMenu } = useContextMenu({ id: FOLDER_MENU_ID });
  
  const {
    videos,
    audios,
    images,
    loading,
    fetchVideos,
    fetchAudios,
    fetchImages,
    deleteMedia,
    renameMedia,
    uploadMediaByUrl,
    openWindow
  } = useAppContext();
  
  // Fix: Explicitly type selectedItem state
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  
  // Determine which media items to display based on type
  const items = type === 'videos' 
    ? videos
    : type === 'audios'
      ? audios
      : type === 'images'
        ? images
        : [];
        
  // Folders to display
  const folders: FileItem[] = type === 'root'
    ? [
        { id: 'videos', name: 'Videos', icon: ICONS.FILE_TYPES.FOLDER, type: 'folder' },
        { id: 'audios', name: 'Audio', icon: ICONS.FILE_TYPES.FOLDER, type: 'folder' },
        { id: 'images', name: 'Images', icon: ICONS.FILE_TYPES.FOLDER, type: 'folder' },
      ]
    : [];
  
  // Load data based on type - simplified
  useEffect(() => {
    if (type === 'videos') {
      fetchVideos();
    } else if (type === 'audios') {
      fetchAudios();
    } else if (type === 'images') {
      fetchImages();
    }
    // Only run when the 'type' prop changes
  }, [type, fetchVideos, fetchAudios, fetchImages]); // Include fetch fns in deps as they are memoized
  
  // Handlers for context menu actions
  // Fix: Add event types
  const handleExplorerContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedItem(null);
    // Fix: Pass event object correctly
    showExplorerMenu({ event: e });
  };
  
  // Fix: Add event and item types
  const handleItemContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    // Fix: Pass event object correctly
    showMediaMenu({ event: e });
  };
  
  // Fix: Add event and item types
  const handleFolderContextMenu = (e: React.MouseEvent, folder: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(folder); // Folders are also FileItems now
    // Fix: Pass event object correctly
    showFolderMenu({ event: e });
  };
  
  // Fix: Add item type
  const handleItemClick = (item: FileItem) => {
    setSelectedItem(item);
  };
  
  // Fix: Add item type
  const handleItemDoubleClick = (item: FileItem) => {
    if (onItemDoubleClick) {
      onItemDoubleClick(item);
    } else {
      // Default behavior is to open the item
      if (item.type === 'folder') {
        // Navigate to folder
      } else {
        // Open media player window for videos and audios
        if (item.type === 'video' || item.type === 'audio') { // Check item type
          // For now, only open MediaPlayer for videos, as audio streaming is removed
          if (item.type === 'video') {
             openWindow(
                `media-player-${item.id}`,
                'media-player',
                `${item.name}`,
                // Revert to passing videoId
                <MediaPlayer videoId={item.id} />, 
                {
                  icon: ICONS.FILE_TYPES.VIDEO,
                  size: { width: 720, height: 480 },
                }
             );
          } else {
             // Optionally handle audio double-click differently (e.g., show info dialog)
             console.log("Audio playback not implemented:", item.name);
          }
        }
        // Open image viewer for images
        else if (item.type === 'image') { // Check item type
          openWindow(
            `image-viewer-${item.id}`,
            'image-viewer',
            `${item.name}`,
            <img 
              src={item.url} 
              alt={item.name} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            />, 
            {
              icon: ICONS.FILE_TYPES.IMAGE,
              size: { width: 640, height: 480 },
            }
          );
        }
      }
    }
  };

  // Fix: Add folder item type
  const handleFolderDoubleClick = (folder: FileItem) => {
    if (onItemDoubleClick) {
      onItemDoubleClick(folder); // Pass the folder item directly
    }
    // Add logic here to potentially change the 'type' prop and re-render FileExplorer for the new folder
    console.log("Double clicked folder:", folder.id); 
  };
  
  const handleAddNewFile = () => {
    setIsUploadDialogOpen(true);
  };
  
  const handleRefresh = () => {
    if (type === 'videos') {
      fetchVideos();
    } else if (type === 'audios') {
      fetchAudios();
    } else if (type === 'images') {
      fetchImages();
    }
  };
  
  const handleDeleteItem = () => {
    if (selectedItem) {
      setIsDeleteDialogOpen(true);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (selectedItem) {
      await deleteMedia(selectedItem.id, type.slice(0, -1)); // Convert 'videos' to 'video', etc.
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };
  
  const handleRenameItem = () => {
    if (selectedItem) {
      setNewItemName(selectedItem.name);
      setIsRenameDialogOpen(true);
    }
  };
  
  const handleConfirmRename = async () => {
    if (selectedItem && newItemName) {
      await renameMedia(selectedItem.id, type.slice(0, -1), newItemName); // Convert 'videos' to 'video', etc.
      setIsRenameDialogOpen(false);
      setNewItemName('');
    }
  };
  
  const handleUploadSubmit = async () => {
    if (!uploadUrl) return;
    try {
      await uploadMediaByUrl(type, uploadUrl); // Pass type to uploadMediaByUrl
      setUploadUrl('');
      setIsUploadDialogOpen(false);
      handleRefresh(); // Refresh after upload
    } catch (error) {
      console.error('Upload failed:', error);
      // Optionally show an error message to the user
    }
  };
  
  // Fix: Add item type
  const getIconForItem = (item: FileItem): string => {
    // Use item.icon if available, otherwise determine by type
    if (item.icon) return item.icon;
    if (item.type === 'folder') return ICONS.FILE_TYPES.FOLDER;
    if (item.type === 'video') return ICONS.FILE_TYPES.VIDEO;
    if (item.type === 'audio') return ICONS.FILE_TYPES.AUDIO;
    if (item.type === 'image') return ICONS.FILE_TYPES.IMAGE;
    return ICONS.FILE_TYPES.UNKNOWN; // Default icon
  };
  
  // Fix: Add item type
  const getItemName = (item: FileItem): string => {
    return item.name || 'Unnamed File';
  };
  
  // Fix: Add item type and return type
  const getThumbnailForItem = (item: FileItem): string | undefined => {
    return item.thumbnail_url; // Use thumbnail_url directly
  };
  
  const isLoading = loading[type]; // Get loading state based on current type

  if (isLoading) {
    return <Loading message={`Loading ${type}...`} />;
  }

  return (
    <ExplorerContainer>
      <ExplorerToolbar>
        <ToolbarButtons>
          <Button 
            icon={ICONS.ACTIONS.REFRESH} 
            onClick={handleRefresh}
            disabled={loading.videos || loading.audios || loading.images}
          >
            Refresh
          </Button>
          <Button 
            icon={ICONS.ACTIONS.ADD} 
            onClick={handleAddNewFile}
            disabled={loading.videos || loading.audios || loading.images}
          >
            Add New File
          </Button>
        </ToolbarButtons>
      </ExplorerToolbar>
      
      <ExplorerAddressBar>
        <span className="label">Address:</span>
        <div className="address">{path}</div>
      </ExplorerAddressBar>
      
      <ExplorerContent onContextMenu={handleExplorerContextMenu}>
        {folders.map((folder: FileItem) => (
          <Icon
            key={folder.id}
            src={folder.icon || ICONS.FILE_TYPES.FOLDER}
            label={folder.name}
            size="64px"
            onClick={() => handleItemClick(folder)}
            onDoubleClick={() => handleFolderDoubleClick(folder)}
            onContextMenu={(e) => handleFolderContextMenu(e, folder)}
            selected={selectedItem?.id === folder.id}
          />
        ))}
        {items.map((item: FileItem) => (
          <Icon
            key={item.id}
            src={getThumbnailForItem(item) || getIconForItem(item)}
            label={getItemName(item)}
            size="64px"
            onClick={() => handleItemClick(item)}
            onDoubleClick={() => handleItemDoubleClick(item)}
            onContextMenu={(e) => handleItemContextMenu(e, item)}
            selected={selectedItem?.id === item.id}
          />
        ))}
      </ExplorerContent>
      
      <ExplorerStatusBar>
        <div>{items.length + folders.length} object(s)</div>
        {selectedItem && <div> | Selected: {getItemName(selectedItem)}</div>}
      </ExplorerStatusBar>
      
      {/* Context Menus */}
      <MenuStyles>
        <Menu id={EXPLORER_MENU_ID} animation={false}>
          <Item onClick={handleAddNewFile}>
            <img src={ICONS.ACTIONS.NEW} alt="" />
            Upload New File (URL)
          </Item>
          <Separator />
          <Item onClick={handleRefresh}>
            <img src={ICONS.ACTIONS.REFRESH} alt="" />
            Refresh
          </Item>
          <Separator />
          <Item onClick={() => {}}> {/* Placeholder for properties */}
            <img src={ICONS.MISC.SETTINGS} alt="" />
            Properties
          </Item>
        </Menu>
        <Menu id={MEDIA_ITEM_MENU_ID} animation={false}>
          <Item onClick={() => selectedItem && handleItemDoubleClick(selectedItem)}>
            <img src={ICONS.ACTIONS.OPEN} alt="" />
            Open
          </Item>
          <Separator />
          <Item onClick={handleRenameItem}>
            <img src={ICONS.ACTIONS.RENAME} alt="" />
            Rename
          </Item>
          <Item onClick={handleDeleteItem}>
            <img src={ICONS.ACTIONS.DELETE} alt="" />
            Delete
          </Item>
          <Separator />
          <Item onClick={() => {}}> {/* Placeholder */}
            <img src={ICONS.MISC.SETTINGS} alt="" />
            Properties
          </Item>
        </Menu>
        <Menu id={FOLDER_MENU_ID} animation={false}>
           <Item onClick={() => selectedItem && handleFolderDoubleClick(selectedItem)}>
            <img src={ICONS.ACTIONS.OPEN} alt="" />
            Open
          </Item>
          {/* Add other folder-specific actions if needed */}
        </Menu>
      </MenuStyles>
      
      {/* Dialogs */}
      {isUploadDialogOpen && (
        <Dialog
          isOpen={isUploadDialogOpen}
          title="Upload New File"
          onClose={() => setIsUploadDialogOpen(false)}
          message={
            <div>
              <p>Enter the URL of the media file to upload:</p>
              <input 
                type="text" 
                value={uploadUrl} 
                onChange={(e) => setUploadUrl(e.target.value)} 
                style={{ width: 'calc(100% - 10px)', marginBottom: '10px' }} 
              />
            </div>
          }
          buttons={[
            { label: 'Upload', onClick: handleUploadSubmit },
            { label: 'Cancel', onClick: () => setIsUploadDialogOpen(false) }
          ]}
        />
      )}

      {isRenameDialogOpen && selectedItem && (
        <Dialog
          isOpen={isRenameDialogOpen}
          title="Rename Item"
          onClose={() => setIsRenameDialogOpen(false)}
          message={
            <div>
              <p>Enter new name for "{selectedItem ? getItemName(selectedItem) : ''}":</p>
              <input 
                type="text" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                style={{ width: 'calc(100% - 10px)', marginBottom: '10px' }} 
              />
            </div>
          }
          buttons={[
            { label: 'Rename', onClick: handleConfirmRename },
            { label: 'Cancel', onClick: () => setIsRenameDialogOpen(false) }
          ]}
        />
      )}

      {isDeleteDialogOpen && selectedItem && (
        <Dialog
          isOpen={isDeleteDialogOpen}
          title="Confirm Delete"
          onClose={() => setIsDeleteDialogOpen(false)}
          message={<span>Are you sure you want to delete "{selectedItem ? getItemName(selectedItem) : ''}"?</span>}
          buttons={[
            { label: 'Yes', onClick: handleConfirmDelete },
            { label: 'No', onClick: () => setIsDeleteDialogOpen(false) }
          ]}
          icon={ICONS.MISC.WARNING} // Use a warning icon
        />
      )}
    </ExplorerContainer>
  );
};

export default FileExplorer;