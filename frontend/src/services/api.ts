import axios from 'axios';
import { Scene, TranscriptItem } from '../types';

const API_BASE_URL = 'http://localhost:8000';

interface VideoStreamResponse {
  stream_url: string;
}

interface TranscriptResponse {
  transcript: TranscriptItem[];
}

interface ScenesResponse {
  scenes: Scene[];
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  maxContentLength: 20000000, // 20MB max response size
  maxBodyLength: 20000000, // 20MB max request size
});

// Add a request interceptor to handle retries
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
    const config = error.config;
    
    // Only retry once
    if (!config || !config._retry) {
      config._retry = true;
      return axiosInstance(config);
    }
  }
  return Promise.reject(error);
});

const api = {
  // Collections
  getCollections: async () => {
    const response = await axiosInstance.get('/collections');
    return response.data;
  },

  // Videos
  getVideos: async (collectionId = 'default') => {
    const response = await axiosInstance.get(`/collection/${collectionId}/videos`);
    return response.data;
  },

  getVideoStream: async (videoId: string): Promise<VideoStreamResponse> => {
    const response = await axiosInstance.get<VideoStreamResponse>(`/video/${videoId}/stream`);
    return response.data;
  },

  getVideoTranscript: async (videoId: string): Promise<TranscriptResponse> => {
    const response = await axiosInstance.get<TranscriptResponse>(`/video/${videoId}/transcript`);
    return response.data;
  },

  getVideoScenes: async (videoId: string): Promise<ScenesResponse> => {
    const response = await axiosInstance.get<ScenesResponse>(`/video/${videoId}/scenes`);
    return response.data;
  },

  indexVideo: async (videoId: string, indexType: string, prompt: string | null = null): Promise<any> => {
    const response = await axiosInstance.post(`/video/${videoId}/index`, { video_id: videoId, index_type: indexType, prompt });
    return response.data;
  },

  searchVideo: async (videoId: string, query: string, indexType: string = 'spoken_word', searchType: string = 'semantic'): Promise<TranscriptResponse> => {
    const response = await axiosInstance.get<TranscriptResponse>(`/video/${videoId}/search`, {
      params: { query, index_type: indexType, search_type: searchType }
    });
    return response.data;
  },

  deleteVideo: async (videoId: string, collectionId: string = 'default') => {
    const response = await axiosInstance.delete(`/video/${videoId}`, { params: { collection_id: collectionId } });
    return response.data;
  },

  // Audio
  getAudios: async (collectionId: string = 'default') => {
    const response = await axiosInstance.get(`/collection/${collectionId}/audios`);
    return response.data;
  },

  deleteAudio: async (audioId: string, collectionId: string = 'default') => {
    const response = await axiosInstance.delete(`/audio/${audioId}`, { params: { collection_id: collectionId } });
    return response.data;
  },

  // Images
  getImages: async (collectionId: string = 'default') => {
    const response = await axiosInstance.get(`/collection/${collectionId}/images`);
    return response.data;
  },

  deleteImage: async (imageId: string, collectionId: string = 'default') => {
    const response = await axiosInstance.delete(`/image/${imageId}`, { params: { collection_id: collectionId } });
    return response.data;
  },

  // Upload
  uploadByUrl: async (url: string, name: string | null = null, description: string | null = null, collectionId: string = 'default', mediaType: string | null = null) => {
    const formData = new FormData();
    formData.append('url', url);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    formData.append('collection_id', collectionId);
    if (mediaType) formData.append('media_type', mediaType);
    
    const response = await axiosInstance.post('/upload/url', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadFile: async (file: File, name: string | null = null, description: string | null = null, collectionId: string = 'default', mediaType: string | null = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name || file.name);
    if (description) formData.append('description', description);
    formData.append('collection_id', collectionId);
    if (mediaType) formData.append('media_type', mediaType);
    
    const response = await axiosInstance.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Rename
  renameMedia: async (mediaType: string, mediaId: string, name: string) => {
    const formData = new FormData();
    formData.append('name', name);
    
    const response = await axiosInstance.put(`/rename/${mediaType}/${mediaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api; 