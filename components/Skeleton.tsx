import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`bg-white/5 rounded-lg animate-shimmer ${className}`} />
);

export const MovieCardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-36 xs:w-44 sm:w-52 md:w-56 space-y-3 animate-pulse">
    <Skeleton className="aspect-[2/3] rounded-2xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const MovieRowSkeleton: React.FC = () => (
  <div className="mb-16 px-6 lg:px-12">
    <div className="flex items-center gap-3 mb-6">
      <Skeleton className="h-8 w-1" />
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="flex gap-6 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="relative h-[85vh]">
    <Skeleton className="absolute inset-0" />
    <div className="absolute bottom-0 left-0 right-0 p-16 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-16 w-2/3" />
      <Skeleton className="h-12 w-40" />
    </div>
  </div>
);

export const CinemaHallOfFameSkeleton: React.FC = () => (
  <div className="py-16 md:py-24 px-6 lg:px-12">
    <Skeleton className="h-[300px] rounded-3xl" />
  </div>
);

export const DetailPageSkeleton: React.FC = () => (
  <div className="pt-32 px-4 lg:px-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Skeleton className="aspect-[2/3] rounded-2xl" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  </div>
);

export const SearchResultSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 xs:gap-8">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="space-y-3 animate-pulse">
        <Skeleton className="aspect-[2/3] rounded-2xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);