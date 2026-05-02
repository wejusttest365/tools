import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import Accordion from './Accordion';
import '../styles/ImageConverter.css';

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'chinese', label: 'Chinese' },
];

export default function ImageOCR() {
  const [files, setFiles] = useState([]);
  const [ocrText, setOcrText] = useState('');
  const [language, setLanguage] = useState('english');
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // Compress/optimize image before OCR to speed up processing
  const preprocessImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Resize image to max 2000px on longest side for better OCR speed and quality
        let { width, height } = img;
        const maxSize = 2000;

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

        // Draw with better quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with optimized quality
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type || 'image/jpeg',
          0.95
        );
      };

      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    setError('');
    setOcrText('');
    setProgress(0);

    try {
      const worker = await createWorker(language);
      let allText = '';
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
          // Show progress
          setProgress(Math.round(((i + 0.3) / totalFiles) * 100));

          // Preprocess image for better OCR
          const optimizedBlob = await preprocessImage(file);

          // Recognize text
          setProgress(Math.round(((i + 0.7) / totalFiles) * 100));
          const { data: { text } } = await worker.recognize(optimizedBlob);

          allText += `--- ${file.name} ---\n${text}\n\n`;
          setProgress(Math.round(((i + 1) / totalFiles) * 100));
        } catch (fileError) {
          const errorMsg = `Error processing ${file.name}: ${fileError.message}`;
          console.error(errorMsg);
          allText += `--- ${file.name} ---\n[ERROR: ${fileError.message}]\n\n`;
          setError(prev => prev + (prev ? '\n' : '') + errorMsg);
        }
      }

      await worker.terminate();
      setOcrText(allText);
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      const errorMsg = `OCR Error: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      setProcessing(false);
      setProgress(0);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setOcrText('');
    setError('');
    setProgress(0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ocrText);
    alert('Text copied to clipboard!');
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📁</div>
            <h1>Add Files Here</h1>
            <p>Drop your images anywhere to start OCR processing</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>📝 Free Image OCR</h1>
            <p>Extract editable text from screenshots, scans, receipts, invoices, and photos instantly.</p>
            <div className="tool-badges">
              <span className="badge">✓ Image OCR</span>
              <span className="badge">✓ Multi-Language</span>
              <span className="badge">✓ No Signup</span>
              <span className="badge">✓ Fast Preview</span>
              <span className="badge">✓ Privacy First</span>
            </div>
          </div>

          <div className="tool-body">
            <div className="format-group">
              <label>OCR Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
              <div className="drop-icon">📷</div>
              <h2>Upload images to extract text</h2>
              <p>Supports JPG, PNG, WEBP, GIF, BMP, TIFF, ICO • Multiple files supported</p>
            </div>

            {files.length > 0 && (
              <div id="preview-section">
                <h3>Images ready for OCR ({files.length})</h3>
                <div className="preview-grid">
                  {files.map((file, idx) => (
                    <div key={idx} className="preview-card">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                      <div className="preview-card-info">
                        <div className="fname">{file.name}</div>
                        <div className="fsize">{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <button className="remove-btn" onClick={() => removeFile(idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {processing && (
              <div id="progress-wrap">
                {error && (
                  <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '0.9rem'
                  }}>
                    ⚠️ {error}
                  </div>
                )}
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                </div>
                <p className="progress-label">Processing: {progress}% • {Math.ceil((files.length * (100 - progress)) / 100)} remaining…</p>
              </div>
            )}

            {error && !processing && (
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
              <button className="btn-convert" onClick={handleProcess} disabled={!files.length || processing}>
                🔎 Extract Text
              </button>
              {files.length > 0 && (
                <button className="btn-clear" onClick={clearAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>

            {ocrText && (
              <div className="download-section">
                <h3>📄 OCR Result</h3>
                <textarea className="ocr-result" value={ocrText} readOnly rows={10} />
                <button className="btn-download-all" onClick={copyToClipboard}>Copy Result</button>
              </div>
            )}
          </div>
        </article>

        <section className="tool-info">
          <Accordion title="Why use Image OCR?" defaultOpen={false}>
            <p>Convert images to editable text instantly. Perfect for:</p>
            <ul>
              <li>Extracting text from scanned documents and receipts</li>
              <li>Converting screenshots to searchable text</li>
              <li>Reading text from photos and images</li>
              <li>Creating accessible content from visual materials</li>
              <li>Automating data entry from printed forms</li>
            </ul>
          </Accordion>

          <Accordion title="How to use Image OCR" defaultOpen={false}>
            <ol>
              <li>Select your preferred language for text recognition</li>
              <li>Upload images containing text (screenshots, scans, photos)</li>
              <li>Click "Extract Text" to start the OCR process</li>
              <li>Wait for processing to complete (may take a few seconds per image)</li>
              <li>Copy the extracted text or use it in your documents</li>
            </ol>
            <p><strong>Tip:</strong> For best results, use clear, high-contrast images with good lighting. Avoid blurry or distorted text.</p>
          </Accordion>

          <Accordion title="FAQ" defaultOpen={false}>
            <div className="faq-item">
              <h4>What languages are supported?</h4>
              <p>English, Spanish, French, German, and Chinese are currently supported. More languages will be added soon.</p>
            </div>
            <div className="faq-item">
              <h4>How accurate is the OCR?</h4>
              <p>Accuracy depends on image quality, but typically ranges from 90-95% for clear text. Results improve with better image quality.</p>
            </div>
            <div className="faq-item">
              <h4>Can I process multiple images at once?</h4>
              <p>Yes, you can upload multiple images and they'll be processed sequentially. Results are combined in a single text output.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data secure?</h4>
              <p>All processing happens locally in your browser. Images and extracted text never leave your device.</p>
            </div>
          </Accordion>
        </section>

        <section>
          <h2 className="section-title">🛠️ Related Image Tools</h2>
          <div className="shortcut-grid">
            <a href="#" className="shortcut-card">
              <div className="sc-icon">🗜️</div>
              <div className="sc-name">Image Compressor</div>
              <div className="sc-desc">Reduce file sizes</div>
            </a>
            <a href="#" className="shortcut-card">
              <div className="sc-icon">🔄</div>
              <div className="sc-name">Image Converter</div>
              <div className="sc-desc">Change formats</div>
            </a>
            <a href="#" className="shortcut-card">
              <div className="sc-icon">✂️</div>
              <div className="sc-name">Image Cropper</div>
              <div className="sc-desc">Trim images</div>
            </a>
            <a href="#" className="shortcut-card">
              <div className="sc-icon">🎨</div>
              <div className="sc-name">Image Editor</div>
              <div className="sc-desc">Basic editing</div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
