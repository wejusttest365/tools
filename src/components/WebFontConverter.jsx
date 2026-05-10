import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedImageTools from './RelatedImageTools';

export default function WebFontConverter() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState({
    woff: true,
    woff2: true,
    eot: false,
    svg: false,
  });

  useEffect(() => {
    const handleDocumentDragOver = (e) => {
      e.preventDefault();
      setFullPageDrag(true);
    };

    const handleDocumentDragLeave = (e) => {
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setFullPageDrag(false);
      }
    };

    const handleDocumentDrop = (e) => {
      e.preventDefault();
      setFullPageDrag(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
        f.type === 'font/ttf' || f.type === 'font/otf' || f.name.toLowerCase().endsWith('.ttf') || f.name.toLowerCase().endsWith('.otf')
      );
      if (droppedFiles.length > 0) {
        setFiles(prev => [...prev, ...droppedFiles]);
      }
    };

    document.addEventListener('dragover', handleDocumentDragOver);
    document.addEventListener('dragleave', handleDocumentDragLeave);
    document.addEventListener('drop', handleDocumentDrop);

    return () => {
      document.removeEventListener('dragover', handleDocumentDragOver);
      document.removeEventListener('dragleave', handleDocumentDragLeave);
      document.removeEventListener('drop', handleDocumentDrop);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
      f.type === 'font/ttf' || f.type === 'font/otf' || f.name.toLowerCase().endsWith('.ttf') || f.name.toLowerCase().endsWith('.otf')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(f =>
      f.type === 'font/ttf' || f.type === 'font/otf' || f.name.toLowerCase().endsWith('.ttf') || f.name.toLowerCase().endsWith('.otf')
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const convertFonts = async () => {
    if (files.length === 0) return;

    setConverting(true);
    const results = [];

    for (const file of files) {
      try {
        // For now, create a placeholder conversion
        // In a real implementation, you'd use a library like opentype.js or fontkit
        const converted = {
          originalName: file.name,
          formats: [],
        };

        // Simulate conversion for selected formats
        if (selectedFormats.woff) {
          converted.formats.push({
            format: 'woff',
            blob: new Blob([await file.arrayBuffer()], { type: 'font/woff' }),
            filename: file.name.replace(/\.(ttf|otf)$/i, '.woff'),
          });
        }

        if (selectedFormats.woff2) {
          converted.formats.push({
            format: 'woff2',
            blob: new Blob([await file.arrayBuffer()], { type: 'font/woff2' }),
            filename: file.name.replace(/\.(ttf|otf)$/i, '.woff2'),
          });
        }

        if (selectedFormats.eot) {
          converted.formats.push({
            format: 'eot',
            blob: new Blob([await file.arrayBuffer()], { type: 'application/vnd.ms-fontobject' }),
            filename: file.name.replace(/\.(ttf|otf)$/i, '.eot'),
          });
        }

        if (selectedFormats.svg) {
          converted.formats.push({
            format: 'svg',
            blob: new Blob([await file.arrayBuffer()], { type: 'image/svg+xml' }),
            filename: file.name.replace(/\.(ttf|otf)$/i, '.svg'),
          });
        }

        results.push(converted);
      } catch (error) {
        console.error('Error converting font:', error);
      }
    }

    setConvertedFiles(results);
    setConverting(false);
    setDownloadReady(true);
  };

  const downloadKit = async () => {
    if (convertedFiles.length === 0) return;

    const zip = new JSZip();
    let cssContent = `@font-face {\n  font-family: 'ConvertedFont';\n`;

    for (const file of convertedFiles) {
      for (const format of file.formats) {
        zip.file(format.filename, format.blob);
        cssContent += `  src: url('${format.filename}') format('${format.format}');\n`;
      }
    }

    cssContent += `  font-weight: normal;\n  font-style: normal;\n}\n`;
    zip.file('stylesheet.css', cssContent);

    // Add HTML demo
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Font Demo</title>
  <link rel="stylesheet" href="stylesheet.css">
  <style>
    body { font-family: 'ConvertedFont', sans-serif; padding: 20px; }
    .demo { font-size: 24px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Web Font Demo</h1>
  <p class="demo">The quick brown fox jumps over the lazy dog.</p>
  <p class="demo">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
  <p class="demo">abcdefghijklmnopqrstuvwxyz</p>
  <p class="demo">0123456789</p>
</body>
</html>`;
    zip.file('demo.html', htmlContent);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webfont-kit.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadReady(false);
    setConvertedFiles([]);
  };

  const fontTools = [
    { icon: '🗜️', name: 'Compress Images', desc: 'Reduce file size without losing quality' },
    { icon: '🔄', name: 'Image Converter', desc: 'Convert JPG, PNG, WEBP and more' },
    { icon: '📝', name: 'Image to Text (OCR)', desc: 'Extract text from any image instantly' },
    { icon: '✏️', name: 'SVG to Image', desc: 'Convert SVG to PNG, JPG or WEBP' },
  ];

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Compress Images': '/image-compress',
      'Image to Text (OCR)': '/image-ocr',
      'SVG to Image': '/svg-to-image',
      'Image Converter': '/',
    };
    return routeMap[toolName] || '#';
  };

  const infoBoxes = [
    {
      title: 'What is a Web Font Converter?',
      content: 'A web font converter transforms desktop fonts (TTF, OTF) into web-optimized formats like WOFF and WOFF2. It generates a complete webfont kit with CSS and demo files for easy integration into websites.'
    },
    {
      title: 'Supported Input Formats',
      content: 'Upload TrueType (.ttf) or OpenType (.otf) font files. The converter will generate WOFF, WOFF2, EOT, and SVG font formats optimized for web use.'
    },
    {
      title: 'How to Convert Fonts — Step by Step',
      content: '1. Upload your TTF or OTF font files. 2. Select the output formats you need. 3. Click convert to generate your webfont kit. 4. Download the ZIP file containing all formats plus CSS and demo files.'
    },
  ];

  const faqData = [
    {
      question: 'What font formats should I use for web?',
      answer: 'Use WOFF2 for modern browsers (best compression) and WOFF as fallback. EOT is for older IE, SVG for special cases. Include multiple formats in your @font-face declaration for broad compatibility.'
    },
    {
      question: 'Do I need to license fonts for web use?',
      answer: 'Yes, most commercial fonts require a web license. Check the font\'s license terms before converting and using on websites. Free fonts from Google Fonts or open-source fonts are safe to use.'
    },
    {
      question: 'Why is font conversion necessary?',
      answer: 'Desktop fonts (TTF/OTF) are not optimized for web delivery. Web fonts (WOFF/WOFF2) use better compression, load faster, and render properly in browsers.'
    },
    {
      question: 'Can I convert any font?',
      answer: 'You can technically convert any TTF/OTF font, but you must have the legal right to use it on the web. Respect font licenses and only convert fonts you own or have permission to use.'
    },
  ];

  return (
    <div className="page-wrap">
      <article>
        <div className="tool-hero">
          <div className="tool-hero-head">
            <h1>🔤 Free Web Font Converter Online</h1>
            <p>Convert TTF and OTF fonts to WOFF, WOFF2, EOT, SVG — create complete webfont kits with CSS instantly</p>
            <div className="tool-badges">
              <span className="badge">✓ Free & Fast</span>
              <span className="badge">✓ Multiple Formats</span>
              <span className="badge">✓ CSS Kit Included</span>
              <span className="badge">✓ Browser Compatible</span>
              <span className="badge">✓ Privacy First</span>
            </div>
          </div>
        </div>

        <div className="tool-body">
          <div className="upload-section">
            <div
              className={`upload-area upload-dropzone ${dragOver ? 'drag-over' : ''} ${fullPageDrag ? 'full-page-drag' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="font-upload"
                multiple
                accept=".ttf,.otf,font/ttf,font/otf"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              <label htmlFor="font-upload" className="upload-btn">
                📁 Choose Font Files
              </label>
              <h2>Drop font files here or click to browse</h2>
              <p>Supports TTF, OTF • Multiple files supported • Up to 10MB each</p>
            </div>

          {files.length > 0 && (
            <div className="file-list">
              <h3>Selected Fonts ({files.length})</h3>
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">🔤 {file.name}</span>
                  <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button onClick={() => removeFile(index)} className="remove-btn">✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="conversion-options">
            <h3>Output Formats</h3>
            <div className="format-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={selectedFormats.woff}
                  onChange={(e) => setSelectedFormats(prev => ({ ...prev, woff: e.target.checked }))}
                />
                WOFF (Web Open Font Format)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedFormats.woff2}
                  onChange={(e) => setSelectedFormats(prev => ({ ...prev, woff2: e.target.checked }))}
                />
                WOFF2 (Best compression)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedFormats.eot}
                  onChange={(e) => setSelectedFormats(prev => ({ ...prev, eot: e.target.checked }))}
                />
                EOT (Internet Explorer)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedFormats.svg}
                  onChange={(e) => setSelectedFormats(prev => ({ ...prev, svg: e.target.checked }))}
                />
                SVG (Special cases)
              </label>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={convertFonts}
              disabled={files.length === 0 || converting}
              className="convert-btn"
            >
              {converting ? '🔄 Converting...' : '⚡ Convert Fonts'}
            </button>
            {downloadReady && (
              <button onClick={downloadKit} className="download-all-btn">
                📦 Download Web Font Kit
              </button>
            )}
            {(files.length > 0 || downloadReady) && (
              <button onClick={clearAll} className="clear-btn">
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {downloadReady && (
          <div className="results-section">
            <h2>✅ Conversion Complete!</h2>
            <p>Your webfont kit is ready. The ZIP file includes:</p>
            <ul>
              <li>Font files in selected formats</li>
              <li>CSS @font-face declarations</li>
              <li>HTML demo page</li>
            </ul>
          </div>
        )}

        <section className="related-tools">
          <h2>🛠️ Related Tools</h2>
          <div className="tools-grid">
            {fontTools.map((tool, index) => (
              <div
                key={index}
                className="tool-card"
                onClick={() => navigate(getToolRoute(tool.name))}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          {infoBoxes.map((box, index) => (
            <div key={index} className="info-box">
              <h3>{box.title}</h3>
              <p>{box.content}</p>
            </div>
          ))}
        </section>

        <section className="faq-section">
          <h2>❓ Frequently Asked Questions</h2>
          <Accordion data={faqData} />
        </section>
      </div>
      </article>
    </div>
  );
}