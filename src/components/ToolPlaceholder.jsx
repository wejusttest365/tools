import Accordion from './Accordion';
import { useNavigate } from 'react-router-dom';
import '../styles/ImageConverter.css';

const toolTitles = {
  'ocr': 'Image to Text (OCR)',
  'svg-to-image': 'SVG to Image',
  'image-to-svg': 'Image to SVG',
  'favicon': 'Favicon Generator',
  'base64': 'Image to Base64',
  'image-from-base64': 'Base64 to Image',
  'css-beautify': 'CSS Beautifier',
  'box-shadow': 'Box Shadow Generator',
  'multi-box-shadow': 'Multi Box Shadow',
  'clip-css': 'Clip Image CSS',
  'card-builder': 'CSS Card Builder',
  'gradient-generator': 'Gradient Generator',
  'html-formatter': 'HTML Formatter',
  'css-errors': 'CSS Error Checker',
  'base64-codec': 'Base64 Encoder/Decoder',
  'json-formatter': 'JSON Formatter',
  'font-converter': 'Font Converter',
  'merge-pdf': 'Merge PDF',
  'reorder-pdf': 'Reorder PDF Pages',
  'contact': 'Contact Us',
};

export default function ToolPlaceholder({ currentPage }) {
  const navigate = useNavigate();
  const title = toolTitles[currentPage] || 'Coming Soon';

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Image Converter': '/',
      'Image Compressor': '/image-compress',
      'Image OCR': '/image-ocr',
      'SVG to Image': '/svg-to-image'
    };
    return routeMap[toolName] || '#';
  };

  return (
    <div className="page-wrap">
      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🛠️ {title}</h1>
            <p>
              This tool page is not yet built, but the menu is working.
              Use the Image Converter or Compress Images tools while we add more tools.
            </p>
          </div>
          <div className="tool-body">
            <div className="format-group">
              <label>Next Steps</label>
              <p>
                We are building this tool next. For now, browse the main image tools or return to the converter/compressor pages.
              </p>
            </div>
          </div>
        </article>

        <section className="tool-info">
          <Accordion title={`Why use ${title}?`} defaultOpen={false}>
            <p>This tool provides essential functionality for web developers and designers:</p>
            <ul>
              <li><strong>Professional Quality:</strong> High-quality processing with attention to detail</li>
              <li><strong>Fast & Efficient:</strong> Quick processing without compromising on results</li>
              <li><strong>Privacy First:</strong> All processing happens locally in your browser</li>
              <li><strong>Free to Use:</strong> No registration or hidden costs</li>
              <li><strong>Cross-Platform:</strong> Works on all modern browsers and devices</li>
            </ul>
          </Accordion>

          <Accordion title={`How to use ${title}`} defaultOpen={false}>
            <ol>
              <li>Navigate to the tool page when it's available</li>
              <li>Upload or input your files/data as required</li>
              <li>Configure any available options or settings</li>
              <li>Click the process/convert button</li>
              <li>Download or copy your results</li>
            </ol>
            <p><strong>Note:</strong> This tool is currently under development. Check back soon for full functionality!</p>
          </Accordion>

          <Accordion title="Available Tools" defaultOpen={true}>
            <p>While we build more tools, you can use our current image processing tools:</p>
            <ul>
              <li><strong>Image Converter:</strong> Convert between different image formats (JPG, PNG, WebP, etc.)</li>
              <li><strong>Image Compressor:</strong> Reduce file sizes while maintaining quality</li>
              <li><strong>Image OCR:</strong> Extract text from images using advanced recognition</li>
              <li><strong>SVG to Image:</strong> Convert SVG vector graphics to PNG/JPG</li>
            </ul>
          </Accordion>

          <Accordion title="FAQ" defaultOpen={false}>
            <div className="faq-item">
              <h4>When will this tool be available?</h4>
              <p>We're actively developing this tool and plan to release it soon. Check back regularly for updates!</p>
            </div>
            <div className="faq-item">
              <h4>Will it be free?</h4>
              <p>Yes, like all our tools, this will be completely free with no registration required.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data secure?</h4>
              <p>All our tools process data locally in your browser. Your files never leave your device.</p>
            </div>
            <div className="faq-item">
              <h4>How do I get notified when it's ready?</h4>
              <p>Follow our development updates or check back to this page regularly.</p>
            </div>
          </Accordion>
        </section>

        <section>
          <h2 className="section-title">🛠️ Related Tools</h2>
          <div className="shortcut-grid">
            <button onClick={() => { navigate(getToolRoute('Image Converter')); window.scrollTo(0, 0); }} className="shortcut-card" style={{ background: 'none', border: '1px solid #ccc', cursor: 'pointer', padding: 10, borderRadius: 6, textAlign: 'left' }}>
              <div className="sc-icon">🔄</div>
              <div className="sc-name">Image Converter</div>
              <div className="sc-desc">Change formats</div>
            </button>
            <button onClick={() => { navigate(getToolRoute('Image Compressor')); window.scrollTo(0, 0); }} className="shortcut-card" style={{ background: 'none', border: '1px solid #ccc', cursor: 'pointer', padding: 10, borderRadius: 6, textAlign: 'left' }}>
              <div className="sc-icon">🗜️</div>
              <div className="sc-name">Image Compressor</div>
              <div className="sc-desc">Reduce file sizes</div>
            </button>
            <button onClick={() => { navigate(getToolRoute('Image OCR')); window.scrollTo(0, 0); }} className="shortcut-card" style={{ background: 'none', border: '1px solid #ccc', cursor: 'pointer', padding: 10, borderRadius: 6, textAlign: 'left' }}>
              <div className="sc-icon">📝</div>
              <div className="sc-name">Image OCR</div>
              <div className="sc-desc">Extract text</div>
            </button>
            <button onClick={() => { navigate(getToolRoute('SVG to Image')); window.scrollTo(0, 0); }} className="shortcut-card" style={{ background: 'none', border: '1px solid #ccc', cursor: 'pointer', padding: 10, borderRadius: 6, textAlign: 'left' }}>
              <div className="sc-icon">🎨</div>
              <div className="sc-name">SVG to Image</div>
              <div className="sc-desc">Vector conversion</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
