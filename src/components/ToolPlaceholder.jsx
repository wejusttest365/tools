import Accordion from './Accordion';
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
  const title = toolTitles[currentPage] || 'Coming Soon';

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
          <Accordion title="Available Tools" defaultOpen={true}>
            <p>While we build more tools, you can use our current image processing tools:</p>
            <ul>
              <li><strong>Image Converter:</strong> Convert between different image formats (JPG, PNG, WebP, etc.)</li>
              <li><strong>Image Compressor:</strong> Reduce file sizes while maintaining quality</li>
              <li><strong>Image OCR:</strong> Extract text from images using advanced recognition</li>
            </ul>
          </Accordion>

          <Accordion title="Coming Soon" defaultOpen={false}>
            <p>We're actively developing these tools:</p>
            <ul>
              <li>SVG to Image and Image to SVG converters</li>
              <li>Favicon generator for websites</li>
              <li>Base64 image encoder/decoder</li>
              <li>CSS tools (beautifier, box-shadow generator, gradient generator)</li>
              <li>Code formatters (HTML, JSON, CSS)</li>
              <li>PDF manipulation tools</li>
              <li>Font converter</li>
            </ul>
          </Accordion>

          <Accordion title="How to Navigate" defaultOpen={false}>
            <ol>
              <li>Use the menu button (☰) in the top-right to access all tools</li>
              <li>Click on any tool name to navigate to that page</li>
              <li>Built tools show full functionality</li>
              <li>Coming soon tools show this placeholder page</li>
            </ol>
          </Accordion>
        </section>
      </main>
    </div>
  );
}
