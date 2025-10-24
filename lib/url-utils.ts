/**
 * URL validation utility to prevent TLD errors
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    // Check if it's a valid HTTP/HTTPS URL with a proper TLD
    return (
      (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') &&
      urlObj.hostname.includes('.') && // Must have a TLD
      urlObj.hostname.length > 0
    );
  } catch {
    return false;
  }
}

/**
 * Sanitize URL to prevent TLD errors
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // If it's already a valid URL, return as is
  if (isValidUrl(url)) {
    return url;
  }
  
  // If it's a relative URL or local path, return empty string
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return '';
  }
  
  // If it doesn't start with http/https, try to make it valid
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // If it looks like a domain, add https://
    if (url.includes('.') && !url.includes(' ')) {
      return `https://${url}`;
    }
    // Otherwise, return empty string
    return '';
  }
  
  return url;
}

/**
 * Safe URL processing for arrays of URLs
 */
export function sanitizeUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }
  
  return urls
    .map(url => sanitizeUrl(url))
    .filter(url => url.length > 0);
}
