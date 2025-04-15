import { VideoDBConfig, VideoStreamOptions } from '../types';

export interface VideoDBService {
  connect: () => Promise<void>;
  uploadVideo: (file: File | string) => Promise<string>;
  getVideoStream: (videoId: string, options?: VideoStreamOptions) => Promise<string>;
  searchVideos: (query: string, page?: number, limit?: number) => Promise<any[]>;
  indexVideo: (videoId: string) => Promise<void>;
  getVideoMetadata: (videoId: string) => Promise<any>;
}

class VideoDBServiceImpl implements VideoDBService {
  private apiKey: string;
  private baseUrl: string;
  private collection: any;

  constructor(config: VideoDBConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.videodb.io';
  }

  async connect(): Promise<void> {
    try {
      // Initialize VideoDB connection
      const response = await fetch(`${this.baseUrl}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to VideoDB');
      }

      const data = await response.json();
      this.collection = data.collection;
    } catch (error) {
      console.error('VideoDB connection error:', error);
      throw error;
    }
  }

  async uploadVideo(file: File | string): Promise<string> {
    try {
      // Handle both file uploads and URLs
      const formData = new FormData();
      if (typeof file === 'string') {
        formData.append('url', file);
      } else {
        formData.append('file', file);
      }

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const data = await response.json();
      return data.videoId;
    } catch (error) {
      console.error('Video upload error:', error);
      throw error;
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`VideoDB API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getVideoStream(videoId: string, options?: VideoStreamOptions): Promise<string> {
    const queryParams = new URLSearchParams();
    
    if (options?.quality) {
      queryParams.append('quality', options.quality);
    }
    if (options?.format) {
      queryParams.append('format', options.format);
    }

    const endpoint = `/videos/${videoId}/stream${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await this.makeRequest<{ streamUrl: string }>(endpoint);
    return response.streamUrl;
  }

  async searchVideos(query: string, page: number = 1, limit: number = 10): Promise<any[]> {
    const endpoint = `/videos/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    return this.makeRequest(endpoint);
  }

  async getVideoMetadata(videoId: string) {
    const endpoint = `/videos/${videoId}/metadata`;
    return this.makeRequest(endpoint);
  }

  async indexVideo(videoId: string): Promise<void> {
    try {
      // Index both spoken words and scenes
      await Promise.all([
        this.indexSpokenWords(videoId),
        this.indexScenes(videoId)
      ]);
    } catch (error) {
      console.error('Video indexing error:', error);
      throw error;
    }
  }

  private async indexSpokenWords(videoId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/index/spoken-words`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to index spoken words');
    }
  }

  private async indexScenes(videoId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/index/scenes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: "Describe the scene in detail"
      })
    });

    if (!response.ok) {
      throw new Error('Failed to index scenes');
    }
  }
}

export const createVideoDBService = (config: VideoDBConfig): VideoDBService => {
  return new VideoDBServiceImpl(config);
}; 