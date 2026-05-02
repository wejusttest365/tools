import { useEffect } from 'react';

/**
 * Hook to manage SEO meta tags for each page
 * Updates document title and meta tags
 */
export function useSEO({ title, description, keywords, canonical, ogImage, ogType = 'website' }) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to create or update meta tag
    const updateMeta = (name, content, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      );
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);

    // Update Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    
    if (ogImage) {
      updateMeta('og:image', ogImage, true);
    }

    // Update Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    if (ogImage) {
      updateMeta('twitter:image', ogImage);
    }

    // Update canonical tag
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonical);

  }, [title, description, keywords, canonical, ogImage, ogType]);
}
