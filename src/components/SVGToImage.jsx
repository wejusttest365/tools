import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Accordion from './Accordion';
import RelatedImageTools from './RelatedImageTools';
import '../styles/ImageConverter.css';

export default function SVGToImage() {
  const navigate = useNavigate();
  const [svgFile, setSvgFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const fileInputRef = useRef(null);

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
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'image/svg+xml');
      if (droppedFiles.length > 0) {
        handleFileSelect(droppedFiles[0]);
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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'image/svg+xml');
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  const handleFileSelect = (file) => {
    if (file && file.type === 'image/svg+xml') {
      setSvgFile(file);
      setError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid SVG file.');
      setSvgFile(null);
      setPreview('');
    }
  };

  const downloadImage = async (format = 'png') => {
    if (!svgFile || !preview) return;

    setProcessing(true);
    setError('');

    try {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${svgFile.name.replace('.svg', '')}.${format}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
            setProcessing(false);
          },
          mimeType,
          format === 'png' ? undefined : 0.95
        );
      };

      img.onerror = () => {
        setError('Failed to process SVG. Ensure it\'s a valid SVG file.');
        setProcessing(false);
      };

      img.src = preview;
    } catch (err) {
      setError(`Error: ${err.message}`);
      setProcessing(false);
    }
  };

  const clearFile = () => {
    setSvgFile(null);
    setPreview('');
    setError('');
  };

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Image Compressor': '/image-compress',
      'Image Converter': '/',
      'Image OCR': '/image-ocr',
      'Favicon Generator': '/tool/favicon'
    };
    return routeMap[toolName] || '#';
  };

  return (
    <div className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">🎨</div>
            <h1>Add SVG File Here</h1>
            <p>Drop your SVG file anywhere to start conversion</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🎨 SVG to Image Converter</h1>
            <p>Convert SVG vector graphics to PNG or JPG images instantly. Perfect for web graphics, icons, and illustrations.</p>
            <div className="tool-badges">
              <span className="badge">✓ SVG to PNG/JPG</span>
              <span className="badge">✓ No Signup</span>
              <span className="badge">✓ Fast Conversion</span>
              <span className="badge">✓ Privacy First</span>
            </div>
          </div>

          <div className="tool-body">
            <div
              className={`drop-zone ${dragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileInput}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div className="drop-icon">🎨</div>
              <h2>Drop or select SVG file to convert</h2>
              <p>Supports SVG files • Drag and drop or click to browse • Instant conversion to PNG/JPG</p>
            </div>

            {svgFile && (
              <div id="preview-section">
                <h3>SVG File Ready ({svgFile.name})</h3>
                <div className="preview-grid">
                  <div className="preview-card">
                    <img src={preview} alt="SVG Preview" />
                    <div className="preview-card-info">
                      <div className="fname">{svgFile.name}</div>
                      <div className="fsize">{(svgFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button className="remove-btn" onClick={clearFile}>✕</button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '12px',
                fontSize: '0.9rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={() => downloadImage('png')}
                disabled={!svgFile || processing}
              >
                📥 Download as PNG
              </button>
              <button
                className="btn-convert"
                onClick={() => downloadImage('jpg')}
                disabled={!svgFile || processing}
              >
                📥 Download as JPG
              </button>
              {svgFile && (
                <button className="btn-clear" onClick={clearFile}>
                  🗑️ Clear File
                </button>
              )}
            </div>
          </div>
        </article>

        <section className="tool-info">
          <Accordion title="Why convert SVG to Image?" isOpen={false} content={
            <div>
              <p>SVG to Image conversion is useful for:</p>
              <ul>
                <li>Creating raster versions of vector graphics for web use</li>
                <li>Exporting designs for social media and presentations</li>
                <li>Sharing graphics with non-vector compatible tools</li>
                <li>Reducing file complexity for simpler applications</li>
                <li>Ensuring compatibility with all platforms and devices</li>
              </ul>
            </div>
          } />

          <Accordion title="How to use SVG to Image" isOpen={false} content={
            <div>
              <ol>
                <li>Upload your SVG file by dragging, dropping, or clicking to browse</li>
                <li>Preview your SVG to ensure it looks correct</li>
                <li>Choose PNG (preserves transparency) or JPG (better compression) format</li>
                <li>Click the download button to save your converted image</li>
              </ol>
              <p><strong>Tip:</strong> PNG format preserves transparency and is ideal for logos and icons. JPG provides better compression for photographs and complex graphics.</p>
            </div>
          } />

          <Accordion title="FAQ" isOpen={false} content={
            <div>
              <div className="faq-item">
                <h4>What file sizes are supported?</h4>
                <p>We support SVG files up to 50MB in size. Larger files may take longer to process.</p>
              </div>
              <div className="faq-item">
                <h4>Is my data secure?</h4>
                <p>All conversion happens locally in your browser. SVG files and converted images never leave your device.</p>
              </div>
              <div className="faq-item">
                <h4>Can I batch convert multiple files?</h4>
                <p>Currently, you can convert one SVG at a time. Convert multiple files by repeating the process.</p>
              </div>
              <div className="faq-item">
                <h4>What's the difference between PNG and JPG?</h4>
                <p>PNG preserves transparency and is lossless, making it ideal for logos and graphics with transparent backgrounds. JPG uses lossy compression, resulting in smaller file sizes but no transparency support.</p>
              </div>
            </div>
          } />
        </section>

        <RelatedImageTools />
      </main>
    </div>
  );
}
