import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { ICONS } from '../../assets/icons';
import Button from '../common/Button';
import Loading from '../common/Loading';
import api from '../../services/api';
import { Scene, TranscriptItem } from '../../types';

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
`;

const Tab = styled.div<{$active?: boolean}>`
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid;
  border-color: ${props => props.$active 
    ? '#ffffff #808080 #c0c0c0 #ffffff' 
    : '#c0c0c0 #c0c0c0 #808080 #c0c0c0'};
  margin-right: 2px;
  background-color: ${props => props.$active ? '#c0c0c0' : '#a0a0a0'};
  position: relative;
  bottom: -1px;
  z-index: ${props => props.$active ? 1 : 0};
`;

const VideoContainer = styled.div`
  flex-grow: 1;
  background-color: black;
  position: relative;
`;

const ControlsContainer = styled.div<{ $progress?: number }>`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #c0c0c0;
  gap: 8px;
  
  .progress {
    flex-grow: 1;
    height: 10px;
    background-color: white;
    border: 1px solid;
    border-color: #808080 #ffffff #ffffff #808080;
    position: relative;
    
    .bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: #000080;
      width: ${props => props.$progress || 0}%;
    }
  }
  
  .time {
    font-size: 12px;
    font-family: "MS Sans Serif", sans-serif;
  }
`;

const ContentContainer = styled.div<{ $padding?: string }>`
  flex-grow: 1;
  overflow: auto;
  padding: ${props => props.$padding || '8px'};
  background-color: white;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #c0c0c0;
  background-color: #f0f0f0;
  
  input {
    flex-grow: 1;
    border: 1px solid;
    border-color: #808080 #ffffff #ffffff #808080;
    padding: 2px 5px;
  }
`;

const StyledTranscriptItem = styled.div`
  padding: 5px;
  margin: 2px 0;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &.highlight {
    background-color: #000080;
    color: white;
  }
  
  .timestamp {
    font-weight: bold;
    margin-right: 5px;
  }
`;

const SceneItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  .scene-thumbnail {
    width: 120px;
    height: 67px;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  
  .scene-details {
    flex-grow: 1;
    
    .scene-timestamp {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .scene-description {
      font-size: 12px;
      max-height: 60px;
      overflow: hidden;
    }
  }
`;

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

interface MediaPlayerProps {
  videoId: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ videoId }) => {
  const [activeTab, setActiveTab] = useState('player');
  const [playing, setPlaying] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [indexStatus, setIndexStatus] = useState({
    spoken_words: false,
    scenes: false
  });
  const [indexing, setIndexing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const playerRef = useRef<ReactPlayer>(null);
  
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading video with ID:', videoId);
        const streamResponse = await api.getVideoStream(videoId);
        
        if (streamResponse && streamResponse.stream_url) {
            console.log('Received stream URL:', streamResponse.stream_url);
            setStreamUrl(streamResponse.stream_url);
        } else {
            console.error('Invalid stream response:', streamResponse);
            throw new Error('Failed to get stream URL - invalid response format');
        }
        
        // Check if video is already indexed
        try {
          // Try to fetch transcript
          const transcriptResponse = await api.getVideoTranscript(videoId);
          if (transcriptResponse.transcript && transcriptResponse.transcript.length > 0) {
            setTranscript(transcriptResponse.transcript);
            setIndexStatus(prev => ({ ...prev, spoken_words: true }));
          }
        } catch (err: any) {
          console.log('Transcript not available:', err);
          setIndexStatus(prev => ({ ...prev, spoken_words: false })); 
          setTranscript([]); 
        }
        
        // Try to fetch scenes
        try {
          const scenesResponse = await api.getVideoScenes(videoId);
          if (scenesResponse.scenes && scenesResponse.scenes.length > 0) {
            setScenes(scenesResponse.scenes);
            setIndexStatus(prev => ({ ...prev, scenes: true }));
          }
        } catch (err: any) {
          console.log('Scenes not available:', err);
          setIndexStatus(prev => ({ ...prev, scenes: false })); 
          setScenes([]);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error(`Error loading video:`, err);
        setError(`Failed to load video: ${err.message}`);
        setStreamUrl('');
        setLoading(false);
      }
    };
    
    if (videoId) {
      console.log('Starting video load for ID:', videoId);
      loadVideo();
    }
  }, [videoId]);
  
  // Index video for spoken words
  const handleIndexSpokenWords = async () => {
    if (indexing || indexStatus.spoken_words) return;
    
    try {
      setIndexing(true);
      await api.indexVideo(videoId, 'spoken_words');
      
      // Fetch transcript after indexing
      const transcriptResponse = await api.getVideoTranscript(videoId);
      setTranscript(transcriptResponse.transcript || []);
      setIndexStatus(prev => ({ ...prev, spoken_words: true }));
      setIndexing(false);
    } catch (err) {
      console.error('Error indexing video for spoken words:', err);
      setError('Failed to index video. Please try again.');
      setIndexing(false);
    }
  };
  
  // Index video for scenes
  const handleIndexScenes = async () => {
    if (indexing || indexStatus.scenes) return;
    
    try {
      setIndexing(true);
      await api.indexVideo(videoId, 'scenes');
      
      // Fetch scenes after indexing
      const scenesResponse = await api.getVideoScenes(videoId);
      setScenes(scenesResponse.scenes || []);
      setIndexStatus(prev => ({ ...prev, scenes: true }));
      setIndexing(false);
    } catch (err) {
      console.error('Error indexing video for scenes:', err);
      setError('Failed to index video. Please try again.');
      setIndexing(false);
    }
  };
  
  // Handle player controls
  const handlePlayPause = () => {
    setPlaying(!playing);
  };
  
  const handleStop = () => {
    setPlaying(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setCurrentTime(0);
  };
  
  const handleProgress = (state: { playedSeconds: number; played: number }) => {
    if (!loading) {
      setCurrentTime(state.playedSeconds);
      setProgress(state.played * 100);
    }
  };
  
  const handleDuration = (durationValue: number) => {
    setDuration(durationValue);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playerRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const seekRatio = clickPosition / progressBar.clientWidth;
      const seekTime = seekRatio * duration;
      playerRef.current.seekTo(seekTime, 'seconds');
      setCurrentTime(seekTime);
      setProgress(seekRatio * 100);
    }
  };
  
  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim() || !videoId) return;
    
    const indexType = activeTab === 'transcript' ? 'spoken_word' : 'scene';
    
    try {
      const response = await api.searchVideo(videoId, searchQuery);
      setSearchResults(response.transcript || []);
      setLoading(false);
    } catch (err) {
      console.error('Error searching video:', err);
      setError('Failed to search. Please try again.');
      setLoading(false);
    }
  };
  
  const handleTranscriptItemClick = (item: TranscriptItem) => {
    if (playerRef.current) {
      playerRef.current.seekTo(item.start, 'seconds');
      setPlaying(true); 
      setActiveTab('player'); // Switch back to player tab on click
    }
  };
  
  const handleSceneItemClick = (scene: Scene) => {
    if (playerRef.current) {
      playerRef.current.seekTo(scene.start, 'seconds');
      setPlaying(true);
      setActiveTab('player'); // Switch back to player tab on click
    }
  };
  
  // Filter transcript or scenes based on search
  const filteredTranscript = searchQuery && searchResults.length > 0 && activeTab === 'transcript'
    ? transcript.filter(item => 
        searchResults.some(result => 
          item.start >= result.start && item.end <= result.end
        )
      )
    : transcript;
    
  const filteredScenes = searchQuery && searchResults.length > 0 && activeTab === 'scenes'
    ? scenes.filter(scene => 
        searchResults.some(result => 
          scene.start >= result.start && scene.end <= result.end
        )
      )
    : scenes;
  
  return (
    <PlayerContainer>
      <TabContainer>
        <Tab $active={activeTab === 'player'} onClick={() => setActiveTab('player')}>Player</Tab>
        <Tab $active={activeTab === 'transcript'} onClick={() => setActiveTab('transcript')}>Transcript</Tab>
        <Tab $active={activeTab === 'scenes'} onClick={() => setActiveTab('scenes')}>Scenes</Tab>
        <Tab $active={activeTab === 'search'} onClick={() => setActiveTab('search')}>Search Results</Tab>
      </TabContainer>
      
      {error && (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center', backgroundColor: 'lightyellow' }}>
          Error: {error}
        </div>
      )}

      {loading && <Loading message={`Loading video...`} />}
      
      {!loading && !error && activeTab === 'player' && (
        <VideoContainer>
          {streamUrl ? (
            <ReactPlayer
              ref={playerRef}
              url={streamUrl}
              playing={playing}
              controls={false} // Use custom controls
              width="100%"
              height="100%"
              onProgress={handleProgress}
              onDuration={handleDuration}
              onError={(e) => { console.error('Player error:', e); setError(`Failed to play video.`); }}
            />
          ) : (
            !loading && <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>Could not load media stream.</div>
          )}
        </VideoContainer>
      )}
      
      {/* Controls visible only when player tab is active and media loaded */}
      {!loading && !error && activeTab === 'player' && streamUrl && (
        <ControlsContainer $progress={progress}>
          <Button 
            icon={playing ? ICONS.CONTROLS.PAUSE : ICONS.CONTROLS.PLAY} 
            onClick={handlePlayPause}
            title={playing ? 'Pause' : 'Play'}
          >
            <></>
          </Button>
          <Button 
            icon={ICONS.CONTROLS.STOP} 
            onClick={handleStop}
            title="Stop"
          >
            <></>
          </Button>
          <div className="progress" onClick={handleSeek}>
            <div className="bar"></div>
          </div>
          <div className="time">{formatTime(currentTime)} / {formatTime(duration)}</div>
        </ControlsContainer>
      )}
      
      {/* Transcript Tab Content */}
      {!loading && !error && activeTab === 'transcript' && (
        <ContentContainer $padding="0">
          <SearchContainer>
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} icon={ICONS.MISC.SEARCH}>
              Search
            </Button>
          </SearchContainer>
          
          {!indexStatus.spoken_words && !indexing && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div>Transcript data not available. Video needs to be indexed.</div>
              <Button 
                onClick={handleIndexSpokenWords} 
                style={{ margin: '10px auto' }}
                disabled={indexing}
              >
                Index Video For Spoken Words
              </Button>
            </div>
          )}
          
          {indexing && indexStatus.spoken_words === false && (
            <Loading message="Indexing video transcript. This may take a few minutes..." />
          )}
          
          {indexStatus.spoken_words && !indexing && filteredTranscript.map((item) => (
            <StyledTranscriptItem 
              key={`${item.start}-${item.end}-${item.text.substring(0, 10)}`}
              onClick={() => handleTranscriptItemClick(item)}
            >
              <span className="timestamp">[{formatTime(item.start)}]</span>
              {item.text}
            </StyledTranscriptItem>
          ))}
        </ContentContainer>
      )}
      
      {/* Scenes Tab Content */}
      {!loading && !error && activeTab === 'scenes' && (
        <ContentContainer $padding="0">
          <SearchContainer>
            <input
              type="text"
              placeholder="Search scenes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} icon={ICONS.MISC.SEARCH}>
              Search
            </Button>
          </SearchContainer>
          
          {!indexStatus.scenes && !indexing && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div>Scene data not available. Video needs to be indexed.</div>
              <Button 
                onClick={handleIndexScenes} 
                style={{ margin: '10px auto' }}
                disabled={indexing}
              >
                Index Video For Scenes
              </Button>
            </div>
          )}
          
          {indexing && indexStatus.scenes === false && (
            <Loading message="Indexing video scenes. This may take a few minutes..." />
          )}
          
          {indexStatus.scenes && !indexing && filteredScenes.map((scene, index) => (
            <SceneItem key={`${scene.start}-${scene.end}`} onClick={() => handleSceneItemClick(scene)}>
              <div className="scene-thumbnail">
                <img src={ICONS.FILE_TYPES.IMAGE} alt={`Scene ${formatTime(scene.start)}`} /> 
              </div>
              <div className="scene-details">
                <div className="scene-timestamp">{formatTime(scene.start)} - {formatTime(scene.end)}</div>
                <div className="scene-description">{scene.description}</div> 
              </div>
            </SceneItem>
          ))}
        </ContentContainer>
      )}
      
      {/* Search Results Tab Content */}
      {!loading && !error && activeTab === 'search' && (
        <ContentContainer $padding="0">
          <div style={{ padding: '8px', borderBottom: '1px solid #c0c0c0', background: '#f0f0f0' }}>
            Search results for: "{searchQuery}"
          </div>
          {searchResults.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>No matches found.</div>
          ) : (
            searchResults.map((item) => (
              <StyledTranscriptItem
                key={`${item.start}-${item.end}-${item.text.substring(0, 10)}`}
                onClick={() => handleTranscriptItemClick(item)}
              >
                <span className="timestamp">[{formatTime(item.start)}]</span>
                {item.text}
              </StyledTranscriptItem>
            ))
          )}
        </ContentContainer>
      )}
    </PlayerContainer>
  );
};

export default MediaPlayer;