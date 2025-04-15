import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import { AppProvider } from './contexts/AppContext';
import Desktop from './components/Desktop/Desktop';
import '98.css';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body, html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: "MS Sans Serif", sans-serif;
    font-size: 12px;
  }
  
  #root {
    width: 100%;
    height: 100%;
  }
  
  /* Windows 95/98 scrollbars */
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }
  
  ::-webkit-scrollbar-track {
    background-color: #c0c0c0;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border: 1px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
  }
  
  ::-webkit-scrollbar-button:vertical:start:decrement,
  ::-webkit-scrollbar-button:vertical:end:increment,
  ::-webkit-scrollbar-button:horizontal:start:decrement,
  ::-webkit-scrollbar-button:horizontal:end:increment {
    display: block;
    background-color: #c0c0c0;
    border: 1px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
  }
`;

const App = () => {
  return (
    <AppProvider>
      <Reset />
      <GlobalStyle />
      <Desktop />
    </AppProvider>
  );
};

export default App;
