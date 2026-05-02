import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import ImageCompress from '../components/ImageCompress';

export default function ImageCompressPage() {
  useSEO({
    title: seoConfig.imageCompress.title,
    description: seoConfig.imageCompress.description,
    keywords: seoConfig.imageCompress.keywords,
    canonical: seoConfig.imageCompress.canonical,
    ogImage: seoConfig.imageCompress.ogImage,
  });

  return <ImageCompress />;
}
