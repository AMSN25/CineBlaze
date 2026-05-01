import React from 'react';
import { HeroSkeleton, MovieRowSkeleton, CinemaHallOfFameSkeleton } from './Skeleton';

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030303]">
      <HeroSkeleton />
      <div className="relative -mt-24 z-10 space-y-16 pb-24">
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <CinemaHallOfFameSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    </div>
  );
};

export default LoadingPage;