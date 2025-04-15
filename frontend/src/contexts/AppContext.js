import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  // Windows state - tracks open windows
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  
  // Media collections state
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('default');
  
  // Media items state
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [images, setImages] = useState([]);
  
  // File explorer state
  const [currentFolder, setCurrentFolder] = useState('root');
  
  // Loading states
  const [loading, setLoading] = useState({
    collections: false,
    videos: false,
    audios: false,
    images: false,
    upload: false,
  });
  
  // Error state
  const [error, setError] = useState(null);
  
  // Cache ref to store fetched data
  const cache = useRef({
    collections: new Map(),
    videos: new Map(),
    audios: new Map(),
    images: new Map(),
  });

  // Debounce timer ref
  const debounceTimers = useRef({});

  // Debounce function wrapped in useCallback
  const debounce = useCallback((key, fn, delay = 1000) => {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }
    debounceTimers.current[key] = setTimeout(fn, delay);
  }, []);

  // Fetch videos for selected collection
  const fetchVideos = useCallback(async () => {
    try {
      // If already loading videos, don't make another request
      if (loading.videos) {
        return;
      }
      
      setLoading(prev => ({ ...prev, videos: true }));
      const response = await api.getVideos(selectedCollection);
      
      // Update cache (optional, keep for now)
      const processedVideos = response.videos.map(video => ({
        ...video,
        type: 'video' // Ensure type is set
      }));
      
      cache.current.videos.set(selectedCollection, {
        data: processedVideos,
        timestamp: Date.now()
      });
      
      setVideos(processedVideos);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(prev => ({ ...prev, videos: false }));
    }
  }, [selectedCollection]);

  // Fetch collections wrapped in useCallback
  const fetchCollections = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, collections: true }));
      const response = await api.getCollections();
      setCollections(response.collections);
      // No cache for collections for simplicity
      setError(null);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError('Failed to load collections. Please try again.');
    } finally {
        setLoading(prev => ({ ...prev, collections: false }));
    }
  }, []);
  
  // Load collections on initial render
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  
  // Fetch audios for selected collection - Add useCallback and check
  const fetchAudios = useCallback(async () => {
    try {
      if (loading.audios) { // Add check
        return;
      }
      setLoading(prev => ({ ...prev, audios: true })); // Use functional update
      const response = await api.getAudios(selectedCollection);
      // Update cache (optional)
      cache.current.audios.set(selectedCollection, {
          data: response.audios,
          timestamp: Date.now()
      });
      setAudios(response.audios);
      setError(null);
    } catch (err) {
      console.error('Error fetching audios:', err);
      setError('Failed to load audio files. Please try again.');
      setAudios([]);
    } finally {
      setLoading(prev => ({ ...prev, audios: false })); // Use functional update
    }
  }, [selectedCollection]);
  
  // Fetch images for selected collection - Add useCallback and check
  const fetchImages = useCallback(async () => {
    try {
       if (loading.images) { // Add check
        return;
      }
      setLoading(prev => ({ ...prev, images: true })); // Use functional update
      const response = await api.getImages(selectedCollection);
      // Update cache (optional)
       cache.current.images.set(selectedCollection, {
          data: response.images,
          timestamp: Date.now()
      });
      setImages(response.images);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again.');
      setImages([]);
    } finally {
      setLoading(prev => ({ ...prev, images: false })); // Use functional update
    }
  }, [selectedCollection]);
  
  // Upload media via URL
  const uploadMediaByUrl = async (url, name, description, mediaType) => {
    try {
      setLoading({ ...loading, upload: true });
      await api.uploadByUrl(url, name, description, selectedCollection, mediaType);
      // Reload the appropriate media type
      if (mediaType === 'video' || !mediaType) {
        fetchVideos();
      } else if (mediaType === 'audio') {
        fetchAudios();
      } else if (mediaType === 'image') {
        fetchImages();
      }
      setLoading({ ...loading, upload: false });
      return true;
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Failed to upload media. Please try again.');
      setLoading({ ...loading, upload: false });
      return false;
    }
  };
  
  // Upload media file
  const uploadMediaFile = async (file, name, description, mediaType) => {
    try {
      setLoading({ ...loading, upload: true });
      await api.uploadFile(file, name, description, selectedCollection, mediaType);
      // Reload the appropriate media type
      if (mediaType === 'video' || !mediaType) {
        fetchVideos();
      } else if (mediaType === 'audio') {
        fetchAudios();
      } else if (mediaType === 'image') {
        fetchImages();
      }
      setLoading({ ...loading, upload: false });
      return true;
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Failed to upload media. Please try again.');
      setLoading({ ...loading, upload: false });
      return false;
    }
  };
  
  // Delete media
  const deleteMedia = async (mediaId, mediaType) => {
    try {
      if (mediaType === 'video') {
        await api.deleteVideo(mediaId, selectedCollection);
        fetchVideos();
      } else if (mediaType === 'audio') {
        await api.deleteAudio(mediaId, selectedCollection);
        fetchAudios();
      } else if (mediaType === 'image') {
        await api.deleteImage(mediaId, selectedCollection);
        fetchImages();
      }
      return true;
    } catch (err) {
      console.error(`Error deleting ${mediaType}:`, err);
      setError(`Failed to delete ${mediaType}. Please try again.`);
      return false;
    }
  };
  
  // Rename media
  const renameMedia = async (mediaId, mediaType, newName) => {
    try {
      await api.renameMedia(mediaType, mediaId, newName);
      // Reload the appropriate media type
      if (mediaType === 'video') {
        fetchVideos();
      } else if (mediaType === 'audio') {
        fetchAudios();
      } else if (mediaType === 'image') {
        fetchImages();
      }
      return true;
    } catch (err) {
      console.error(`Error renaming ${mediaType}:`, err);
      setError(`Failed to rename ${mediaType}. Please try again.`);
      return false;
    }
  };
  
  // Window management functions
  const openWindow = (windowId, type, title, content, props = {}) => {
    // Check if window already exists
    const existingWindow = windows.find(w => w.id === windowId);
    
    if (existingWindow) {
      // Just make it active
      setActiveWindowId(windowId);
      return;
    }
    
    // Create new window
    const newWindow = {
      id: windowId,
      type,
      title,
      content,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100,
      },
      size: props.size || { width: 640, height: 480 },
      ...props,
    };
    
    setWindows([...windows, newWindow]);
    setActiveWindowId(windowId);
  };
  
  const closeWindow = (windowId) => {
    setWindows(windows.filter(w => w.id !== windowId));
    
    // Set active window to the highest z-index window
    if (activeWindowId === windowId && windows.length > 1) {
      const highestWindow = [...windows]
        .filter(w => w.id !== windowId)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      
      if (highestWindow) {
        setActiveWindowId(highestWindow.id);
      } else {
        setActiveWindowId(null);
      }
    } else if (windows.length <= 1) {
      setActiveWindowId(null);
    }
  };
  
  const minimizeWindow = (windowId) => {
    setWindows(windows.map(w => 
      w.id === windowId
        ? { ...w, isMinimized: true }
        : w
    ));
    
    // Set active window to the highest z-index window that is not minimized
    const highestWindow = [...windows]
      .filter(w => w.id !== windowId && !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0];
      
    if (highestWindow) {
      setActiveWindowId(highestWindow.id);
    } else {
      setActiveWindowId(null);
    }
  };
  
  const maximizeWindow = (windowId) => {
    setWindows(windows.map(w => 
      w.id === windowId
        ? { ...w, isMaximized: !w.isMaximized }
        : w
    ));
  };
  
  const focusWindow = (windowId) => {
    if (activeWindowId === windowId) return;
    
    // Update z-index values
    const maxZ = Math.max(...windows.map(w => w.zIndex));
    
    setWindows(windows.map(w => 
      w.id === windowId
        ? { ...w, zIndex: maxZ + 1, isMinimized: false }
        : w
    ));
    
    setActiveWindowId(windowId);
  };
  
  const updateWindowPosition = (windowId, position) => {
    setWindows(windows.map(w => 
      w.id === windowId
        ? { ...w, position }
        : w
    ));
  };
  
  // Clean up cache on unmount
  useEffect(() => {
    const currentCache = cache.current;
    return () => {
      currentCache.videos.clear();
    };
  }, []);
  
  // Context value
  const contextValue = {
    // Collections
    collections,
    selectedCollection,
    setSelectedCollection,
    
    // Media items
    videos,
    audios,
    images,
    
    // File explorer
    currentFolder,
    setCurrentFolder,
    
    // Windows
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    
    // API functions
    uploadMediaByUrl,
    uploadMediaFile,
    deleteMedia,
    renameMedia,
    
    // Loading and error states
    loading,
    error,
    setError,
    
    // Refresh functions
    fetchVideos,
    fetchAudios,
    fetchImages,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;