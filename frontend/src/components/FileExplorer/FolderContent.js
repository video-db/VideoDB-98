import React from 'react';
import FileExplorer from './FileExplorer.tsx';

const FolderContent = ({ type, path }) => {
  return <FileExplorer type={type} path={path} />;
};

export default FolderContent; 