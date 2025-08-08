import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Loading.css';

const Loading = ({ 
  size = 'md', 
  variant = 'primary', 
  text = 'Carregando...', 
  fullPage = false 
}) => {
  const sizeMap = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  };

  const LoadingContent = () => (
    <div className="loading-content">
      <Spinner 
        animation="border" 
        variant={variant}
        style={sizeMap[size]}
      />
      {text && <div className="loading-text mt-2">{text}</div>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <LoadingContent />
      </div>
    );
  }

  return (
    <div className="loading-container">
      <LoadingContent />
    </div>
  );
};

export default Loading;