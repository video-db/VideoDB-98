import { ReactNode } from 'react';

export type IconType = string;

export interface IconProps {
  src: string;
  label: string;
  size?: string;
  selected?: boolean;
  textColor?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export interface DialogProps {
  title?: string;
  message: React.ReactNode;
  icon?: IconType;
  isOpen: boolean;
  onClose: () => void;
  buttons?: Array<{ label: string; onClick?: () => void }>;
}

export interface TaskbarItemProps {
  $active: boolean;
}

export interface IconPropsStyled {
  $selected?: boolean;
  $textColor?: string;
  $size?: string;
}

export interface FileItem {
  id: string;
  name: string;
  url?: string;
  thumbnail_url?: string;
  type?: string;
  icon?: string;
}

export interface VideoDBConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface VideoStreamOptions {
  videoId: string;
  quality?: string;
  format?: string;
}

export interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  icon?: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  zIndex?: number;
  padding?: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: string;
    separator?: boolean;
    disabled?: boolean;
  }>;
  onClose: () => void;
}

export interface Scene {
  start: number;
  end: number;
  description: string;
}

export interface TranscriptItem {
  start: number;
  end: number;
  text: string;
} 