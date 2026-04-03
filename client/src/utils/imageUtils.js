/**
 * imageUtils.js
 * Centralized utility for handling image optimizations across the project.
 */

const IMG_BASE_URL = 'http://localhost:5000/api/uploads'; // Fallback to common dev, will be updated to use current axios config logic

/**
 * Transforms an image URL with Cloudinary or Unsplash optimization parameters.
 * @param {string} url - The original image URL.
 * @param {number} width - Desired width.
 * @param {number} height - Optional desired height.
 * @returns {string} - The optimized URL.
 */
export const getOptimizedUrl = (url, width = 800, height) => {
  if (!url) return url;

  // 1. Resolve local/relative paths
  let fullUrl = url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
    fullUrl = `${IMG_BASE_URL}/${url}`;
  }

  // 2. Optimize Cloudinary
  if (fullUrl.includes('cloudinary.com')) {
    // f_auto: automatic format (WebP/AVIF)
    // q_auto: automatic quality
    // c_fill / g_auto: smart cropping
    let transformations = `f_auto,q_auto,w_${width},c_fill,g_auto`;
    if (height) transformations += `,h_${height}`;
    
    // Check if it already has transformations
    if (fullUrl.includes('/upload/')) {
        return fullUrl.replace('/upload/', `/upload/${transformations}/`);
    }
  }

  // 3. Optimize Unsplash
  if (fullUrl.includes('unsplash.com')) {
    const baseUrl = fullUrl.split('?')[0];
    let params = `?auto=format,compress&q=80&w=${width}`;
    if (height) params += `&h=${height}&fit=crop`;
    return `${baseUrl}${params}`;
  }

  return fullUrl;
};
