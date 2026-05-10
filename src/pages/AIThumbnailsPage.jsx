import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import AIThumbnails from '../components/AIThumbnailsNew';

export default function AIThumbnailsPage() {
  useSEO({
    title: seoConfig.aiThumbnails.title,
    description: seoConfig.aiThumbnails.description,
    keywords: seoConfig.aiThumbnails.keywords,
    canonical: seoConfig.aiThumbnails.canonical,
    ogImage: seoConfig.aiThumbnails.ogImage,
  });

  return <AIThumbnails />;
}
