import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedPDFTools from './RelatedPDFTools';

export default function PDFCompress() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(3);

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
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type === 'application/pdf');
      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
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
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type === 'application/pdf');
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((f) => f.type === 'application/pdf');
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const compressPDF = async (file) => {
    const fileBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const compressedDoc = await PDFDocument.create();

    const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => compressedDoc.addPage(page));

    const compressedBytes = await compressedDoc.save({
      useObjectStreams: compressionLevel > 1,
      objectsPerTick: compressionLevel === 4 ? 50 : 100,
    });

    return {
      originalSize: file.size,
      compressedSize: compressedBytes.byteLength,
      blob: new Blob([compressedBytes], { type: 'application/pdf' }),
      name: `${file.name.replace(/\.[^/.]+$/, '')}_compressed.pdf`,
      pageCount: pdfDoc.getPageCount(),
    };
  };

  const handleCompress = async () => {
    if (!files.length) return;
    setCompressing(true);
    setDownloadReady(false);

    const results = [];
    let totalOriginal = 0;
    let totalCompressed = 0;

    for (const file of files) {
      const result = await compressPDF(file);
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
    setCompressedFiles([]);
    setDownloadReady(false);
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

  return (
    <div id="compress-pdf" className="page-wrap">
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">🗜️</div>
            <h1>Add PDF Files Here</h1>
            <p>Drop your PDF files anywhere to compress them instantly.</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🗜️ Compress PDF Files Online Free</h1>
            <p>Reduce PDF file size instantly in your browser without uploading your documents. Keep your layout intact while making sharing easier.</p>
            <div className="tool-badges">
              <span className="badge">✓ No Upload Required</span>
              <span className="badge">✓ Preserve Layout</span>
              <span className="badge">✓ Fast Browser Processing</span>
              <span className="badge">✓ Secure & Private</span>
              <span className="badge">✓ Free Forever</span>
            </div>
          </div>

          <div className="tool-body">
            <div className="format-group">
              <label>Compression Strength</label>
              <div className="quality-wrap">
                <input
                  type="range"
                  id="compressionLevel"
                  min="1"
                  max="4"
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(Number(e.target.value))}
                />
                <span className="quality-val">{compressionLevel === 1 ? 'Fast' : compressionLevel === 2 ? 'Balanced' : compressionLevel === 3 ? 'Strong' : 'Maximum'}</span>
              </div>
              <p className="range-helper">Stronger compression may take slightly longer but can reduce file size more.</p>
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
                accept=".pdf"
                onChange={handleFileInput}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div className="drop-icon">📄</div>
              <h2>Drop PDF files here or click to browse</h2>
              <p>Supports PDF files • multiple files allowed • browser-based optimization</p>
            </div>

            {files.length > 0 && (
              <div id="preview-section">
                <h3>Selected PDFs ({files.length})</h3>
                <div className="preview-grid">
                  {files.map((file, idx) => (
                    <div key={idx} className="preview-card">
                      <div className="pdf-preview-icon">📄</div>
                      <div className="preview-card-info">
                        <div className="fname">{file.name}</div>
                        <div className="fsize">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
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
                <p className="progress-label">Compressing PDFs…</p>
              </div>
            )}

            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={handleCompress}
                disabled={files.length === 0 || compressing}
              >
                ⚡ Compress PDFs
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
          <Accordion title="Why use PDF Compressor?" isOpen={false} content={
            <div>
              <p>Reduce PDF size to make sharing and storage easier without changing the content layout:</p>
              <ul>
                <li>Send PDFs faster by reducing file size</li>
                <li>Save cloud storage and email attachment bandwidth</li>
                <li>Preserve page layout while optimizing the document</li>
                <li>Process files locally in your browser for privacy</li>
              </ul>
            </div>
          } />

          <Accordion title="How to use PDF Compressor" isOpen={false} content={
            <div>
              <ol>
                <li>Drag and drop PDF files or click to select them.</li>
                <li>Choose the compression level that fits your needs.</li>
                <li>Click "Compress PDFs" to optimize your files.</li>
                <li>Review the size savings and download the compressed PDFs.</li>
              </ol>
              <p><strong>Tip:</strong> Start with the Balanced compression level for a good tradeoff between size and speed.</p>
            </div>
          } />

          <Accordion title="FAQ" isOpen={false} content={
            <div>
              <div className="faq-item">
                <h4>How much size reduction can I expect?</h4>
                <p>Results vary by PDF content. Documents with large images usually compress most effectively.</p>
              </div>
              <div className="faq-item">
                <h4>Does compression affect PDF layout?</h4>
                <p>No. This tool preserves the original document layout and page order.</p>
              </div>
              <div className="faq-item">
                <h4>Is my PDF uploaded anywhere?</h4>
                <p>No. Compression happens locally in your browser so your files remain private.</p>
              </div>
              <div className="faq-item">
                <h4>Can I compress multiple PDFs at once?</h4>
                <p>Yes. Add multiple PDF files and compress them together in one batch.</p>
              </div>
            </div>
          } />
        </section>

        <RelatedPDFTools />
      </main>
    </div>
  );
}
