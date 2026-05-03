import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedPDFTools from './RelatedPDFTools';

export default function PDFReorder() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [reorderedPDF, setReorderedPDF] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

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
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type === 'application/pdf');
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = Array.from(e.target.files).find((f) => f.type === 'application/pdf');
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = async (selectedFile) => {
    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const count = pdfDoc.getPageCount();
      setFile(selectedFile);
      setPageCount(count);
      setPageOrder(Array.from({ length: count }, (_, index) => index + 1));
      setDownloadReady(false);
      setReorderedPDF(null);
      setStatusMessage('PDF loaded. Use the arrows to reorder pages.');
    } catch (error) {
      console.error('Invalid PDF file:', error);
      setStatusMessage('Unable to load PDF. Please choose a valid PDF file.');
    }
  };

  const movePage = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= pageOrder.length) return;
    const newOrder = [...pageOrder];
    [newOrder[index], newOrder[nextIndex]] = [newOrder[nextIndex], newOrder[index]];
    setPageOrder(newOrder);
    setDownloadReady(false);
    setReorderedPDF(null);
  };

  const resetOrder = () => {
    setPageOrder(Array.from({ length: pageCount }, (_, index) => index + 1));
    setDownloadReady(false);
    setReorderedPDF(null);
    setStatusMessage('Order reset to original.');
  };

  const clearAll = () => {
    setFile(null);
    setPageCount(0);
    setPageOrder([]);
    setDownloadReady(false);
    setReorderedPDF(null);
    setStatusMessage('');
  };

  const saveReorderedPDF = async () => {
    if (!file || pageOrder.length === 0) return;
    setReordering(true);
    setStatusMessage('Building reordered PDF...');

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const output = await PDFDocument.create();
      const pages = await output.copyPages(pdfDoc, pageOrder.map((pageNum) => pageNum - 1));
      pages.forEach((page) => output.addPage(page));
      const reorderedBytes = await output.save({ useObjectStreams: true, objectsPerTick: 100 });
      const blob = new Blob([reorderedBytes], { type: 'application/pdf' });
      setReorderedPDF(blob);
      setDownloadReady(true);
      setStatusMessage('Reordering complete. Download your reordered PDF.');
    } catch (error) {
      console.error('Error reordering PDF:', error);
      setStatusMessage('Failed to reorder PDF. Try another file or refresh the page.');
    } finally {
      setReordering(false);
    }
  };

  const downloadReorderedPDF = () => {
    if (!reorderedPDF) return;
    const url = URL.createObjectURL(reorderedPDF);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_reordered.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reorder-pdf" className="page-wrap">
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">🔄</div>
            <h1>Add a PDF File</h1>
            <p>Drop your PDF to reorder pages quickly.</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🔄 Reorder PDF Pages Online Free</h1>
            <p>Rearrange the pages in your PDF document and download a reordered version instantly.</p>
            <div className="tool-badges">
              <span className="badge">✓ Drag & Drop Support</span>
              <span className="badge">✓ Page Preview Order</span>
              <span className="badge">✓ Fast Browser Processing</span>
              <span className="badge">✓ Secure & Private</span>
              <span className="badge">✓ Free Forever</span>
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
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div className="drop-icon">📄</div>
              <h2>Drop a PDF file here or click to browse</h2>
              <p>Supports one PDF file at a time • reorder pages with up/down controls</p>
            </div>

            {file && (
              <div id="preview-section">
                <h3>Selected PDF</h3>
                <div className="pdf-list">
                  <div className="pdf-item">
                    <div className="pdf-info">
                      <div className="pdf-icon">📄</div>
                      <div className="pdf-details">
                        <div className="fname">{file.name}</div>
                        <div className="fsize">{pageCount} page{pageCount === 1 ? '' : 's'}</div>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={clearAll}>✕</button>
                  </div>
                </div>
                <h3>Page Order</h3>
                <div className="preview-grid">
                  {pageOrder.map((pageNumber, idx) => (
                    <div key={idx} className="preview-card">
                      <div className="preview-card-info">
                        <div className="fname">Page {pageNumber}</div>
                      </div>
                      <div className="pdf-actions">
                        <button className="move-btn" onClick={() => movePage(idx, -1)} disabled={idx === 0}>⬆️</button>
                        <button className="move-btn" onClick={() => movePage(idx, 1)} disabled={idx === pageOrder.length - 1}>⬇️</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="actions-row">
                  <button type="button" className="btn-clear" onClick={resetOrder}>Reset Order</button>
                </div>
              </div>
            )}

            {statusMessage && <p className="progress-label">{statusMessage}</p>}

            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={saveReorderedPDF}
                disabled={!file || reordering}
              >
                🔄 Reorder PDF
              </button>
              {file && (
                <button className="btn-clear" onClick={clearAll}>🗑️ Clear</button>
              )}
            </div>

            {downloadReady && reorderedPDF && (
              <div className="download-section">
                <h3>✅ Reorder Complete!</h3>
                <p>Your pages are now reordered. Download the updated PDF below.</p>
                <div className="download-info">
                  <div className="file-details">
                    <span className="dname">{file.name.replace(/\.[^/.]+$/, '')}_reordered.pdf</span>
                    <span className="dsize">{pageCount} pages</span>
                  </div>
                  <button className="btn-download-all" onClick={downloadReorderedPDF}>⬇️ Download Reordered PDF</button>
                </div>
              </div>
            )}
          </div>
        </article>

        <section className="tool-info">
          <Accordion title="Why use PDF Page Reorder?" isOpen={false} content={
            <div>
              <p>Reorder pages to organize multi-page documents, reports, and presentations exactly how you need them.</p>
              <ul>
                <li>Place cover pages, tables, and chapters in the right order</li>
                <li>Move pages out of scanned documents or merged PDFs</li>
                <li>Create custom page sequences for sharing or printing</li>
                <li>Fix page order issues in exported PDFs</li>
              </ul>
            </div>
          } />

          <Accordion title="How to use PDF Page Reorder" isOpen={false} content={
            <div>
              <ol>
                <li>Upload your PDF file using drag & drop or file selection.</li>
                <li>Use the arrows to move pages up or down in the order.</li>
                <li>Click "Reorder PDF" to generate the updated document.</li>
                <li>Download the reordered PDF file.</li>
              </ol>
              <p><strong>Tip:</strong> The page order shown is the final order that will be saved into the new PDF.</p>
            </div>
          } />

          <Accordion title="FAQ" isOpen={false} content={
            <div>
              <div className="faq-item">
                <h4>Can I reorder multi-page PDF files?</h4>
                <p>Yes. Select one PDF and use the arrows to reorder any number of pages.</p>
              </div>
              <div className="faq-item">
                <h4>Does the reordered file keep the same quality?</h4>
                <p>Yes. This tool preserves the original page quality and formatting.</p>
              </div>
              <div className="faq-item">
                <h4>Is my PDF uploaded to a server?</h4>
                <p>No. All processing happens locally in your browser for privacy.</p>
              </div>
              <div className="faq-item">
                <h4>What if I upload a non-PDF file?</h4>
                <p>Only PDF files are accepted. If another file is selected, the tool will prompt you to choose a valid PDF.</p>
              </div>
            </div>
          } />
        </section>

        <RelatedPDFTools />
      </main>
    </div>
  );
}
