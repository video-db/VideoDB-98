import React from 'react';
// Import your CSS
import './LoadingAnimation.css';

function LoadingComponent({ type, isLoading }) {
  if (!isLoading) return null;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}>
      <div className="hourglass-loader" role="progressbar" aria-label="Loading..." />
      {type && <div>Loading {type}...</div>}
    </div>
  );
}

export default LoadingComponent; 