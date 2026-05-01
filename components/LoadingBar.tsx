import { useState, useEffect } from 'react';

interface LoadingBarProps {
  progress?: number;
  isLoading?: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress = 0, isLoading = false }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setWidth(Math.min(progress, 90));
    } else {
      setWidth(100);
      setTimeout(() => setWidth(0), 300);
    }
  }, [isLoading, progress]);

  if (width === 0) return null;

  return (
    <div 
      className="loading-bar"
      style={{ width: `${width}%` }}
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default LoadingBar;