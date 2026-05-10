import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import WebFontConverter from '../components/WebFontConverter';

export default function WebFontConverterPage() {
  useSEO({
    title: seoConfig.webFontConverter.title,
    description: seoConfig.webFontConverter.description,
    keywords: seoConfig.webFontConverter.keywords,
    canonical: seoConfig.webFontConverter.canonical,
    ogImage: seoConfig.webFontConverter.ogImage,
  });

  return <WebFontConverter />;
}