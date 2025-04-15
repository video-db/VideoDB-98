import React from 'react';
import styled from 'styled-components';
import { ICONS } from '../../assets/icons';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  
  .hourglass {
    width: 32px;
    height: 32px;
    background: url(${ICONS.ACTIONS.LOADING}) no-repeat;
    animation: sprite 2s steps(15) infinite;
  }
  
  p {
    margin-top: 1rem;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 14px;
  }
  
  @keyframes sprite {
    to { background-position: 0 -480px; }
  }
`;

const Loading = ({ message = 'Loading, please wait...' }) => {
  return (
    <LoadingContainer>
      <div className="hourglass" role="progressbar" aria-label="Loading..." />
      <p>{message}</p>
    </LoadingContainer>
  );
};

export default Loading;