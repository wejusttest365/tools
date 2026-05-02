import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import ImageOCR from '../components/ImageOCR';

export default function ImageOCRPage() {
  useSEO({
    title: seoConfig.imageOCR.title,
    description: seoConfig.imageOCR.description,
    keywords: seoConfig.imageOCR.keywords,
    canonical: seoConfig.imageOCR.canonical,
    ogImage: seoConfig.imageOCR.ogImage,
  });

  return <ImageOCR />;
}
