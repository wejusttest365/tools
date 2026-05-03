import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedPDFTools from './RelatedPDFTools';

function parsePageRanges(input, maxPages) {
  const normalized = input
    .replace(/\s+/g, '')
    .split(/[,;]+/)
    .filter(Boolean);

  const ranges = [];

  for (const part of normalized) {
    const [startRaw, endRaw] = part.split('-');
    const start = Number(startRaw);
    const end = endRaw ? Number(endRaw) : start;

    if (!start || !Number.isInteger(start) || start < 1 || !end || !Number.isInteger(end) || end < start || end > maxPages) {
      return null;
    }

    ranges.push({ start, end });
  }

  return ranges;
}

export default function PDFSplit() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [splitMode, setSplitMode] = useState('single');
  const [splitEvery, setSplitEvery] = useState(2);
  const [rangeInput, setRangeInput] = useState('1-2');
  const [splitting, setSplitting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [splitFiles, setSplitFiles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalParts, setTotalParts] = useState(0);

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
        addFiles(droppedFiles);
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

  const addFiles = async (newFiles) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (!pdfFiles.length) return;

    const loadedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        try {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          return {
            file,
            id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
            pageCount: pdf.getPageCount(),
          };
        } catch (error) {
          console.warn('Skipped invalid PDF:', file.name);
          return null;
        }
      })
    );

    setFiles((prev) => [...prev, ...loadedFiles.filter(Boolean)]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e) => {
    addFiles(Array.from(e.target.files));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [moved] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, moved);
    setFiles(newFiles);
  };

  const parseRangeSettings = (pageCount) => {
    const ranges = parsePageRanges(rangeInput, pageCount);
    if (!ranges) {
      alert('Please enter valid page ranges using numbers and dashes, for example 1-3,5,7-8.');
    }
    return ranges;
  };

  const splitPDFs = async () => {
    if (files.length === 0) return;

    setSplitting(true);
    setDownloadReady(false);

    try {
      const results = [];
      let pagesTotal = 0;

      for (const fileEntry of files) {
        const bytes = await fileEntry.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pageCount = pdf.getPageCount();
        const baseName = fileEntry.file.name.replace(/\.[^/.]+$/, '');

        pagesTotal += pageCount;

        if (splitMode === 'single') {
          for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
            const outputPdf = await PDFDocument.create();
            const [page] = await outputPdf.copyPages(pdf, [pageIndex]);
            outputPdf.addPage(page);
            const blob = new Blob([await outputPdf.save()], { type: 'application/pdf' });
            results.push({
              blob,
              name: `${baseName}_page-${pageIndex + 1}.pdf`,
              fileCount: 1,
            });
          }
        } else if (splitMode === 'every') {
          const chunkSize = Math.max(1, Number(splitEvery) || 1);
          for (let start = 0; start < pageCount; start += chunkSize) {
            const end = Math.min(start + chunkSize, pageCount);
            const indices = Array.from({ length: end - start }, (_, idx) => start + idx);
            const outputPdf = await PDFDocument.create();
            const pages = await outputPdf.copyPages(pdf, indices);
            pages.forEach((page) => outputPdf.addPage(page));
            const blob = new Blob([await outputPdf.save()], { type: 'application/pdf' });
            results.push({
              blob,
              name: `${baseName}_pages-${start + 1}-${end}.pdf`,
              fileCount: 1,
            });
          }
        } else if (splitMode === 'range') {
          const ranges = parseRangeSettings(pageCount);
          if (!ranges) {
            setSplitting(false);
            return;
          }
          for (const { start, end } of ranges) {
            const indices = Array.from({ length: end - start + 1 }, (_, idx) => start - 1 + idx);
            const outputPdf = await PDFDocument.create();
            const pages = await outputPdf.copyPages(pdf, indices);
            pages.forEach((page) => outputPdf.addPage(page));
            const blob = new Blob([await outputPdf.save()], { type: 'application/pdf' });
            results.push({
              blob,
              name: `${baseName}_pages-${start}-${end}.pdf`,
              fileCount: 1,
            });
          }
        }
      }

      setSplitFiles(results);
      setTotalPages(pagesTotal);
      setTotalParts(results.length);
      setDownloadReady(true);
    } catch (error) {
      console.error('Error splitting PDFs:', error);
      alert('Unable to split the selected PDF files. Please verify your files and try again.');
    } finally {
      setSplitting(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setSplitFiles([]);
    setDownloadReady(false);
    setTotalPages(0);
    setTotalParts(0);
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
    splitFiles.forEach((entry) => downloadFile(entry.blob, entry.name));
  };

  const totalPageCount = files.reduce((sum, file) => sum + file.pageCount, 0);

  return (
    <div id="split-pdf" className="page-wrap">
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📄</div>
            <h1>Add PDF Files Here</h1>
            <p>Drop your PDF files anywhere to start splitting</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>✂️ Split PDF Files Online Free</h1>
            <p>Split PDF documents into smaller files by page, page range, or fixed page groups.</p>
            <div className="tool-badges">
              <span className="badge">✓ No Upload Required</span>
              <span className="badge">✓ Custom Ranges</span>
              <span className="badge">✓ Fast Browser Processing</span>
              <span className="badge">✓ Secure & Private</span>
              <span className="badge">✓ Free Forever</span>
            </div>
          </div>

          <div className="tool-body">
            <div className="format-group">
              <label>Split Mode</label>
              <div className="split-mode-group">
                <button
                  type="button"
                  className={`format-chip ${splitMode === 'single' ? 'selected' : ''}`}
                  onClick={() => setSplitMode('single')}
                >
                  Single pages
                </button>
                <button
                  type="button"
                  className={`format-chip ${splitMode === 'every' ? 'selected' : ''}`}
                  onClick={() => setSplitMode('every')}
                >
                  Every N pages
                </button>
                <button
                  type="button"
                  className={`format-chip ${splitMode === 'range' ? 'selected' : ''}`}
                  onClick={() => setSplitMode('range')}
                >
                  Page ranges
                </button>
              </div>
            </div>

            {splitMode === 'every' && (
              <div className="format-group">
                <label htmlFor="splitEvery">Pages per file</label>
                <input
                  id="splitEvery"
                  type="number"
                  min="1"
                  max="100"
                  value={splitEvery}
                  onChange={(e) => setSplitEvery(Number(e.target.value))}
                />
              </div>
            )}

            {splitMode === 'range' && (
              <div className="format-group">
                <label htmlFor="rangeInput">Page ranges</label>
                <textarea
                  id="rangeInput"
                  rows="3"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="Example: 1-3, 5, 7-8"
                />
              </div>
            )}

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
              <p>Supports PDF files • multiple files allowed • reorder before splitting</p>
            </div>

            {files.length > 0 && (
              <div id="preview-section">
                <h3>Selected PDFs ({files.length})</h3>
                <div className="split-summary">
                  <span>{files.length} file{files.length > 1 ? 's' : ''}</span>
                  <span>{totalPageCount} total page{totalPageCount === 1 ? '' : 's'}</span>
                </div>
                <div className="pdf-list">
                  {files.map((entry, idx) => (
                    <div key={entry.id} className="pdf-item">
                      <div className="pdf-info">
                        <div className="pdf-icon">📄</div>
                        <div className="pdf-details">
                          <div className="fname">{entry.file.name}</div>
                          <div className="fsize">{entry.pageCount} page{entry.pageCount === 1 ? '' : 's'}</div>
                        </div>
                      </div>
                      <div className="pdf-actions">
                        {idx > 0 && (
                          <button type="button" className="move-btn" onClick={() => moveFile(idx, idx - 1)} title="Move up">⬆️</button>
                        )}
                        {idx < files.length - 1 && (
                          <button type="button" className="move-btn" onClick={() => moveFile(idx, idx + 1)} title="Move down">⬇️</button>
                        )}
                        <button type="button" className="remove-btn" onClick={() => removeFile(idx)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitting && (
              <div id="progress-wrap">
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: '70%' }} />
                </div>
                <p className="progress-label">Splitting PDFs…</p>
              </div>
            )}

            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={splitPDFs}
                disabled={files.length === 0 || splitting}
              >
                ✂️ Split PDFs
              </button>
              {files.length > 0 && (
                <button className="btn-clear" onClick={clearAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>

            {downloadReady && splitFiles.length > 0 && (
              <div className="download-section">
                <h3>✅ Split Complete!</h3>
                <p>Created {totalParts} file{totalParts === 1 ? '' : 's'} from {files.length} PDF{files.length === 1 ? '' : 's'}.</p>
                <div className="download-list">
                  {splitFiles.map((entry, idx) => (
                    <div key={`${entry.name}-${idx}`} className="download-item">
                      <span className="dname">{entry.name}</span>
                      <button className="download-link" onClick={() => downloadFile(entry.blob, entry.name)}>⬇️ Download</button>
                    </div>
                  ))}
                </div>
                <button className="btn-download-all" onClick={downloadAll}>⬇️ Download All</button>
              </div>
            )}
          </div>
        </article>

        <section className="tool-info">
          <Accordion title="Why use PDF Splitter?" isOpen={false} content={
            <div>
              <p>Split PDF files easily for better document workflow:</p>
              <ul>
                <li>Extract chapters or sections from large PDFs</li>
                <li>Create separate invoices, reports, or presentations</li>
                <li>Send only the pages your recipient needs</li>
                <li>Organize scanned documents into smaller files</li>
                <li>Reduce file size and simplify sharing</li>
              </ul>
            </div>
          } />

          <Accordion title="How to use PDF Splitter" isOpen={false} content={
            <div>
              <ol>
                <li>Drag and drop PDF files or click to select them.</li>
                <li>Choose whether to split by single pages, fixed page groups, or custom ranges.</li>
                <li>Reorder the files if needed before splitting.</li>
                <li>Click "Split PDFs" and wait for the browser to process your files.</li>
                <li>Download the split PDFs individually or click "Download All".</li>
              </ol>
              <p><strong>Tip:</strong> Use the page ranges option when you only need specific pages from a document.</p>
            </div>
          } />

          <Accordion title="FAQ" isOpen={false} content={
            <div>
              <div className="faq-item">
                <h4>Can I split multiple PDFs at once?</h4>
                <p>Yes, you can select multiple PDF files and split them in a single operation.</p>
              </div>
              <div className="faq-item">
                <h4>What page range formats are supported?</h4>
                <p>Use comma-separated ranges like 1-3,5,7-8 or single pages like 4.</p>
              </div>
              <div className="faq-item">
                <h4>Does splitting change my PDF quality?</h4>
                <p>No. This tool preserves the original formatting and quality of each PDF page.</p>
              </div>
              <div className="faq-item">
                <h4>Are the files uploaded anywhere?</h4>
                <p>No. All splitting happens locally in your browser, so your PDFs stay private.</p>
              </div>
            </div>
          } />
        </section>

        <RelatedPDFTools />
      </main>
    </div>
  );
}
