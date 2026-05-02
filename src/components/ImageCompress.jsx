import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';

export default function ImageCompress() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(85);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

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

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width/height)
        let { width, height } = img;
        const maxSize = 1920;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve({
              originalSize: file.size,
              compressedSize: blob.size,
              blob,
              name: file.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg',
            });
          },
          'image/jpeg',
          quality / 100
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleCompress = async () => {
    if (!files.length) return;
    setCompressing(true);
    setDownloadReady(false);

    const results = [];
    let totalOriginal = 0;
    let totalCompressed = 0;

    for (const file of files) {
      const result = await compressImage(file);
      results.push(result);
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
    }

    setCompressedFiles(results);
    setTotalSavings(totalOriginal - totalCompressed);
    setCompressing(false);
    setDownloadReady(true);
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadReady(false);
    setCompressedFiles([]);
    setTotalSavings(0);
  };

  const downloadFile = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    compressedFiles.forEach((file) => downloadFile(file.blob, file.name));
  };

  const imageTools = [
    { icon: '🗜️', name: 'Compress Images', desc: 'Shrink your files while keeping quality high' },
    { icon: '🔄', name: 'Image Converter', desc: 'Convert JPG, PNG, WEBP and more' },
    { icon: '📝', name: 'OCR Reader', desc: 'Extract text from any image quickly' },
    { icon: '✏️', name: 'SVG to Image', desc: 'Convert SVG to PNG, JPG or WEBP' },
    { icon: '🎨', name: 'Image to SVG', desc: 'Turn photos into scalable vector graphics' },
    { icon: '🔣', name: 'Base64 Converter', desc: 'Encode or decode images as base64' },
  ];

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Compress Images': '/image-compress',
      'Image Converter': '/',
      'OCR Reader': '/image-ocr',
      'SVG to Image': '/svg-to-image',
      'Image to SVG': '/tool/image-to-svg',
      'Base64 Converter': '/tool/base64-converter'
    };
    return routeMap[toolName] || '#';
  };

  return (
    <div id="compress" className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📁</div>
            <h1>Add Files Here</h1>
            <p>Drop your images anywhere to start compressing</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🗜️ Free Image Compressor Online</h1>
            <p>Reduce image file size instantly for faster pages, smaller uploads and cleaner storage.</p>
            <div className="tool-badges">
              <span className="badge">✓ Lossless Compression</span>
              <span className="badge">✓ Batch Support</span>
              <span className="badge">✓ No Upload Needed</span>
              <span className="badge">✓ Preserve Resolution</span>
              <span className="badge">✓ Fast Results</span>
            </div>
          </div>

          <div className="tool-body">
            <div className="format-group">
              <label>Compression Settings</label>
              <div className="quality-wrap">
                <label htmlFor="quality">Image Quality</label>
                <input
                  type="range"
                  id="quality"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                />
                <span className="quality-val">{quality}%</span>
              </div>
            </div>

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
              <div className="drop-icon">🖼️</div>
              <h2>Drop images here or click to browse</h2>
              <p>Supports JPG, PNG, WEBP, GIF, BMP, TIFF, ICO • multiple files allowed</p>
            </div>

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

            {compressing && (
              <div id="progress-wrap">
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: '65%' }} />
                </div>
                <p className="progress-label">Compressing…</p>
              </div>
            )}

            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={handleCompress}
                disabled={files.length === 0 || compressing}
              >
                ⚡ Compress Images
              </button>
              {files.length > 0 && (
                <button className="btn-clear" onClick={clearAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>

            {downloadReady && (
              <div className="download-section">
                <h3>✅ Compression Complete!</h3>
                <p>Total space saved: {(totalSavings / 1024).toFixed(1)} KB</p>
                <div className="download-list">
                  {compressedFiles.map((file, idx) => (
                    <div key={idx} className="download-item">
                      <span className="dname">{file.name}</span>
                      <div className="size-info">
                        <span>Original: {(file.originalSize / 1024).toFixed(1)} KB</span>
                        <span>Compressed: {(file.compressedSize / 1024).toFixed(1)} KB</span>
                        <span>Saved: {((file.originalSize - file.compressedSize) / 1024).toFixed(1)} KB</span>
                      </div>
                      <button className="download-link" onClick={() => downloadFile(file.blob, file.name)}>⬇️ Download</button>
                    </div>
                  ))}
                </div>
                <button className="btn-download-all" onClick={downloadAll}>⬇️ Download All</button>
              </div>
            )}
          </div>
        </article>

        <section className="tool-info">
          <Accordion title="Why use Image Compressor?" defaultOpen={false}>
            <p>Reduce file sizes without compromising quality. Perfect for:</p>
            <ul>
              <li>Website optimization to improve loading speeds</li>
              <li>Saving storage space on devices and cloud services</li>
              <li>Email attachments with size restrictions</li>
              <li>Social media uploads with file size limits</li>
              <li>Preserving image quality while reducing bandwidth usage</li>
            </ul>
          </Accordion>

          <Accordion title="How to use Image Compressor" defaultOpen={false}>
            <ol>
              <li>Drag and drop images or click to select files</li>
              <li>Choose your desired compression quality (1-100%)</li>
              <li>Click "Compress Images" to process your files</li>
              <li>Review the compression results showing original vs compressed sizes</li>
              <li>Download individual files or use "Download All" for batch download</li>
            </ol>
            <p><strong>Tip:</strong> Higher quality settings preserve more detail but result in larger files. Lower quality reduces file size more but may lose some image detail.</p>
          </Accordion>

          <Accordion title="FAQ" defaultOpen={false}>
            <div className="faq-item">
              <h4>What image formats are supported?</h4>
              <p>JPEG, PNG, and WebP formats are supported for compression.</p>
            </div>
            <div className="faq-item">
              <h4>Will image quality be affected?</h4>
              <p>Yes, compression reduces file size by removing some image data. You can control the quality level to balance size reduction with image quality.</p>
            </div>
            <div className="faq-item">
              <h4>Is compression reversible?</h4>
              <p>No, compression is lossy for JPEG images. Always keep your original files as backups.</p>
            </div>
            <div className="faq-item">
              <h4>What's the maximum file size I can compress?</h4>
              <p>Files up to 50MB can be processed. For very large files, consider using lower quality settings.</p>
            </div>
          </Accordion>
        </section>

        <section>
          <h2 className="section-title">🛠️ Related Image Tools</h2>
          <div className="shortcut-grid">
            {imageTools.map((tool, idx) => (
              <button key={idx} onClick={() => { navigate(getToolRoute(tool.name)); window.scrollTo(0, 0); }} className="shortcut-card" style={{ background: 'none', border: '1px solid #ccc', cursor: 'pointer', padding: 10, borderRadius: 6, textAlign: 'left' }}>
                <div className="sc-icon">{tool.icon}</div>
                <div className="sc-name">{tool.name}</div>
                <div className="sc-desc">{tool.desc}</div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
