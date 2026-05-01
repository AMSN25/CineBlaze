import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'fade' | 'slide' | 'scale';
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, mode = 'fade' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animations = {
    fade: 'animate-fade',
    slide: 'animate-slide-up',
    scale: 'animate-scale-in'
  };

  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        isVisible ? animations[mode] : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;