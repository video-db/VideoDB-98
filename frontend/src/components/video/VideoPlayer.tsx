import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { VideoStreamOptions } from '../../types';
import { createVideoDBService } from '../../services/videodb';

interface VideoPlayerProps {
  videoId: string;
  options?: VideoStreamOptions;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${VideoContainer}:hover & {
    opacity: 1;
  }
`;

const Button = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  options,
  onError,
  onPlay,
  onPause,
  onEnded,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoDBService = createVideoDBService({
          apiKey: process.env.REACT_APP_VIDEODB_API_KEY || '',
        });
        
        const url = await videoDBService.getVideoStream(videoId, options);
        setStreamUrl(url);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    loadVideo();
  }, [videoId, options]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        onPause?.();
      } else {
        videoRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) * videoRef.current.duration) / 100;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <VideoContainer className={className}>
      <StyledVideo
        ref={videoRef}
        src={streamUrl || ''}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />
      <Controls>
        <Button onClick={handlePlayPause}>
          {isPlaying ? '⏸️' : '▶️'}
        </Button>
        <ProgressBar
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgress}
        />
      </Controls>
    </VideoContainer>
  );
}; 