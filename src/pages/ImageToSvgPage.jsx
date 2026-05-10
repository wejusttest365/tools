import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import ToolPlaceholder from '../components/ToolPlaceholder';

export default function ImageToSvgPage() {
  useSEO({
    title: seoConfig.imageToSvg.title,
    description: seoConfig.imageToSvg.description,
    keywords: seoConfig.imageToSvg.keywords,
    canonical: seoConfig.imageToSvg.canonical,
    ogImage: seoConfig.imageToSvg.ogImage,
  });

  return <ToolPlaceholder currentPage="image-to-svg" />;
}
