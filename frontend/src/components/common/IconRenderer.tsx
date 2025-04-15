import React from 'react';
import { IconProps } from '../../types';

interface IconRendererProps {
  icon?: React.ElementType | string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ icon, className, style, alt = '' }) => {
  if (!icon) {
    return null;
  }

  if (typeof icon === 'string') {
    return <img src={icon} alt={alt} className={className} style={style} />;
  }
  
  const IconComponent = icon;
  return <IconComponent className={className} style={style} />;
};

export default IconRenderer; 