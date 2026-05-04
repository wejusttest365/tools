import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { getSEOConfig } from '../config/seoConfig';
import ToolPlaceholder from '../components/ToolPlaceholder';
import PDFMerge from '../components/PDFMerge';
import PDFSplit from '../components/PDFSplit';
import PDFCompress from '../components/PDFCompress';
import PDFReorder from '../components/PDFReorder';
import CSSBeautifier from '../components/CSSBeautifier';
import ResumeBuilder from '../components/ResumeBuilder';

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

  if (toolId === 'merge-pdf') {
    return <PDFMerge />;
  }

  if (toolId === 'split-pdf') {
    return <PDFSplit />;
  }

  if (toolId === 'compress-pdf') {
    return <PDFCompress />;
  }

  if (toolId === 'reorder-pdf') {
    return <PDFReorder />;
  }

  if (toolId === 'css-beautify') {
    return <CSSBeautifier />;
  }

  if (toolId === 'resume-builder') {
    return <ResumeBuilder />;
  }

  return <ToolPlaceholder currentPage={toolId} />;
}
