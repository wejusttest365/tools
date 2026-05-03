import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedImageTools from './RelatedImageTools';

export default function ImageConverter() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState(92);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const handleDocumentDragOver = (e) => {
      e.preventDefault();
      setFullPageDrag(true);
    };

    const handleDocumentDragLeave = (e) => {
      // Only hide if leaving the entire window
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setFullPageDrag(false);
      }
    };

    const handleDocumentDrop = (e) => {
      e.preventDefault();
      setFullPageDrag(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
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

  const handleDragLeave = (e) => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = () => {
    setConverting(true);
    setTimeout(() => {
      setConverting(false);
      setDownloadReady(true);
    }, 2000);
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadReady(false);
  };

  const imageTools = [
    { icon: '🗜️', name: 'Compress Images', desc: 'Reduce file size without losing quality' },
    { icon: '📝', name: 'Image to Text (OCR)', desc: 'Extract text from any image instantly' },
    { icon: '✏️', name: 'SVG to Image', desc: 'Convert SVG to PNG, JPG or WEBP' },
    { icon: '🎨', name: 'Image to SVG', desc: 'Vectorize raster images to scalable SVG' },
    { icon: '⭐', name: 'Favicon Generator', desc: 'Create website favicons from any image' },
    { icon: '🔣', name: 'Image to Base64', desc: 'Encode images as base64 data strings' },
    { icon: '🖼️', name: 'Base64 to Image', desc: 'Decode base64 strings back to images' },
  ];

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Compress Images': '/image-compress',
      'Image to Text (OCR)': '/image-ocr',
      'SVG to Image': '/svg-to-image',
      'Image Converter': '/',
      'Favicon Generator': '/favicon',
      'Image to Base64': '/image-to-base64',
      'Base64 to Image': '/base64-to-image',
      'Image to SVG': '/image-to-svg'
    };
    return routeMap[toolName] || '#';
  };

  const infoBoxes = [
    {
      title: 'What is an Image Converter?',
      content: 'An image converter is a tool that changes an image from one file format to another — for example, converting a JPG photo into a PNG file or a WEBP image into a classic JPG. Different formats have different trade-offs around file size, transparency support, and browser compatibility. Web Tool Ocean\'s image converter runs entirely in your browser — your images are never uploaded to a server, keeping your data completely private and secure.'
    },
    {
      title: 'Supported Formats & When to Use Each',
      content: 'JPG/JPEG — Best for photographs. Small file size, no transparency. PNG — Lossless quality with full transparency support. WEBP — Modern format by Google. Smaller than JPG/PNG with excellent quality. GIF — Supports animations and simple graphics. BMP — Uncompressed, large file size.'
    },
    {
      title: 'How to Convert Images — Step by Step',
      content: 'Step 1: Select a quick conversion or choose your output format. Step 2: Drop your image files into the upload area, or click to browse. Step 3: Adjust the quality slider if needed. Step 4: Click Convert Images to start. Step 5: Download each converted file or use Download All.'
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Is this free? Yes — completely free. Are my images uploaded? No, everything happens in your browser. Can I convert multiple images? Yes! What is the file size limit? There is no server-side limit.'
    },
  ];

  return (
    <div id="image-converter" className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📁</div>
            <h1>Add Files Here</h1>
            <p>Drop your images anywhere to start converting</p>
          </div>
        </div>
      )}

      <main className="main-col">
        {/* Tool Hero */}
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🔄 Free Image Converter Online</h1>
            <p>Convert JPG, PNG, WEBP, GIF, BMP, TIFF, ICO and more — free, instant, no signup</p>
            <div className="tool-badges">
              <span className="badge">✓ No Signup</span>
              <span className="badge">✓ Batch Convert</span>
              <span className="badge">✓ Browser-Based</span>
              <span className="badge">✓ Privacy First</span>
              <span className="badge">✓ 10+ Formats</span>
            </div>
          </div>

          <div className="tool-body">
            {/* Popular Conversions */}
            <div className="format-group">
              <label>Popular Conversions</label>
              <div className="format-chips">
                <button className={`format-chip ${outputFormat === 'png' ? 'selected' : ''}`} onClick={() => setOutputFormat('png')}>JPG → PNG</button>
                <button className={`format-chip ${outputFormat === 'jpeg' ? 'selected' : ''}`} onClick={() => setOutputFormat('jpeg')}>PNG → JPG</button>
                <button className={`format-chip ${outputFormat === 'png' ? 'selected' : ''}`} onClick={() => setOutputFormat('png')}>WEBP → PNG</button>
                <button className={`format-chip ${outputFormat === 'jpeg' ? 'selected' : ''}`} onClick={() => setOutputFormat('jpeg')}>WEBP → JPG</button>
                <button className={`format-chip ${outputFormat === 'webp' ? 'selected' : ''}`} onClick={() => setOutputFormat('webp')}>PNG → WEBP</button>
                <button className={`format-chip ${outputFormat === 'png' ? 'selected' : ''}`} onClick={() => setOutputFormat('png')}>GIF → PNG</button>
                <button className={`format-chip ${outputFormat === 'jpeg' ? 'selected' : ''}`} onClick={() => setOutputFormat('jpeg')}>BMP → JPG</button>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`drop-zone ${dragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div className="drop-icon">📁</div>
              <h2>Drop images here or click to browse</h2>
              <p>Supports JPG, PNG, WEBP, GIF, BMP, TIFF, ICO • Multiple files supported</p>
            </div>

            {/* Output Format */}
            <div className="output-row">
              <label htmlFor="output-format">Convert to:</label>
              <select
                id="output-format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPG / JPEG</option>
                <option value="webp">WEBP</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
              </select>

              <div className="quality-wrap">
                <label htmlFor="quality">Quality:</label>
                <input
                  type="range"
                  id="quality"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                />
                <span className="quality-val">{quality}%</span>
              </div>
            </div>

            {/* Preview Section */}
            {files.length > 0 && (
              <div id="preview-section">
                <h3>Selected Images ({files.length})</h3>
                <div className="preview-grid">
                  {files.map((file, idx) => (
                    <div key={idx} className="preview-card">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                      <div className="preview-card-info">
                        <div className="fname">{file.name}</div>
                        <div className="fsize">{(file.size / 1024).toFixed(2)} KB</div>
                      </div>
                      <button className="remove-btn" onClick={() => removeFile(idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {converting && (
              <div id="progress-wrap">
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: '75%' }}></div>
                </div>
                <p className="progress-label">Converting…</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={handleConvert}
                disabled={files.length === 0 || converting}
              >
                ⚡ Convert Images
              </button>
              {files.length > 0 && (
                <button className="btn-clear" onClick={clearAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>

            {/* Download Section */}
            {downloadReady && (
              <div className="download-section">
                <h3>✅ Conversion Complete!</h3>
                <div className="download-list">
                  {files.map((file, idx) => (
                    <div key={idx} className="download-item">
                      <span className="dname">{file.name.split('.')[0]}</span>
                      <a href="#" className="download-link">⬇️ Download</a>
                    </div>
                  ))}
                </div>
                <button className="btn-download-all">⬇️ Download All</button>
              </div>
            )}
          </div>
        </article>

        {/* Image Tools Section */}
        {/* <section>
          <h2 className="section-title">🖼️ Image Tools</h2>
          <div className="shortcut-grid">
            {imageTools.map((tool, idx) => (
              <button key={idx} onClick={() => { navigate(getToolRoute(tool.name)); window.scrollTo(0, 0); }} className="shortcut-card" style={{ background: 'none', border: '1px solid #ccc', cursor: 'pointer', padding: 10, borderRadius: 6, textAlign: 'left' }}>
                <div className="sc-icon">{tool.icon}</div>
                <div className="sc-name">{tool.name}</div>
                <div className="sc-desc">{tool.desc}</div>
              </button>
            ))}
          </div>
        </section> */}

        {/* More Popular Tools Section */}
        <RelatedImageTools />

        {/* Info Boxes */}
        {/* <section>
          {infoBoxes.map((box, idx) => (
            <InfoBox key={idx} title={box.title} content={box.content} />
          ))}
        </section> */}

        {/* Accordions */}
        <section className="accordions-section">
          <Accordion
            title="Why Use Image Converter?"
            content={
              <div>
                <p><strong>Fast & Free:</strong> Convert images instantly without any cost or registration.</p>
                <p><strong>Privacy First:</strong> All processing happens in your browser - your images never leave your device.</p>
                <p><strong>Multiple Formats:</strong> Support for JPG, PNG, WEBP, GIF, BMP, TIFF, and ICO files.</p>
                <p><strong>Batch Processing:</strong> Convert multiple images at once with consistent quality settings.</p>
                <p><strong>High Quality:</strong> Maintain image quality while changing formats efficiently.</p>
              </div>
            }
          />

          <Accordion
            title="How to Use Image Converter"
            content={
              <div>
                <h4>Step 1: Choose Your Conversion</h4>
                <p>Select from popular conversions like JPG→PNG or use the dropdown to choose any format.</p>

                <h4>Step 2: Upload Images</h4>
                <p>Drag and drop files into the upload area or click to browse your computer.</p>

                <h4>Step 3: Adjust Settings</h4>
                <p>Set the output format and quality level (for lossy formats like JPG).</p>

                <h4>Step 4: Convert & Download</h4>
                <p>Click "Convert Images" and download your converted files individually or all at once.</p>
              </div>
            }
          />

          <Accordion
            title="Frequently Asked Questions"
            content={
              <div>
                <h4>Is this service free?</h4>
                <p>Yes, completely free with no hidden costs or premium features.</p>

                <h4>Are my images secure?</h4>
                <p>Absolutely. All processing happens locally in your browser. Images never upload to our servers.</p>

                <h4>What file formats are supported?</h4>
                <p>JPG, PNG, WEBP, GIF, BMP, TIFF, and ICO formats are fully supported.</p>

                <h4>Is there a file size limit?</h4>
                <p>No server-side limits. Your browser's memory is the only constraint for very large files.</p>

                <h4>Can I convert multiple images?</h4>
                <p>Yes! Upload as many images as you want and convert them all at once.</p>
              </div>
            }
          />
        </section>
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
      </aside>
    </div>
  );
}

function InfoBox({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="info-box">
      <button className="info-box-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`info-box-body ${open ? 'open' : ''}`}>
        <p>{content}</p>
      </div>
    </div>
  );
}
