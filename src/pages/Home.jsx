import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import ImageConverter from '../components/ImageConverter';

export default function Home() {
  useSEO({
    title: seoConfig.home.title,
    description: seoConfig.home.description,
    keywords: seoConfig.home.keywords,
    canonical: seoConfig.home.canonical,
    ogImage: seoConfig.home.ogImage,
  });

  return <ImageConverter />;
}
