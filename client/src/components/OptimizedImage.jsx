import React, { useState } from 'react';
import { getOptimizedUrl } from '../utils/imageUtils';

/**
 * OptimizedImage component handles automatic format selection, quality compression,
 * lazy loading, and priority fetching for better performance.
 */
const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height,
  className,
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedUrl = getOptimizedUrl(src, width, height);

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      {/* Background loading shimmer or color */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-100 animate-pulse" />
      )}

      <img
        src={optimizedUrl}
        alt={alt || "Image"}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${!className?.includes('object-') ? 'object-cover' : ''} ${className || ''}`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
