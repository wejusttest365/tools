import { useSEO } from '../hooks/useSEO';
import { seoConfig } from '../config/seoConfig';
import SVGToImage from '../components/SVGToImage';

export default function SVGToImagePage() {
  useSEO({
    title: seoConfig.svgToImage.title,
    description: seoConfig.svgToImage.description,
    keywords: seoConfig.svgToImage.keywords,
    canonical: seoConfig.svgToImage.canonical,
    ogImage: seoConfig.svgToImage.ogImage,
  });

  return <SVGToImage />;
}
