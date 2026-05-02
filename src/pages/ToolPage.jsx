import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { getSEOConfig } from '../config/seoConfig';
import ToolPlaceholder from '../components/ToolPlaceholder';

export default function ToolPage() {
  const { toolId } = useParams();
  const seoConfig = getSEOConfig(toolId);

  useSEO({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    canonical: seoConfig.canonical,
    ogImage: seoConfig.ogImage,
  });

  return <ToolPlaceholder currentPage={toolId} />;
}
