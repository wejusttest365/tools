import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedPDFTools from './RelatedPDFTools';

export default function PDFMerge() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [merging, setMerging] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [mergedPDF, setMergedPDF] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

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
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;

    setMerging(true);
    setDownloadReady(false);

    try {
      const mergedPdf = await PDFDocument.create();

      let totalPageCount = 0;

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
        totalPageCount += pdf.getPageCount();
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      setMergedPDF(blob);
      setTotalPages(totalPageCount);
      setDownloadReady(true);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please check your files and try again.');
    } finally {
      setMerging(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadReady(false);
    setMergedPDF(null);
    setTotalPages(0);
  };

  const downloadMergedPDF = () => {
    if (!mergedPDF) return;
    const url = URL.createObjectURL(mergedPDF);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged_document.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pdfTools = [
    { icon: '📎', name: 'Merge PDF', desc: 'Combine multiple PDF files into one' },
    { icon: '🔄', name: 'Reorder PDF', desc: 'Rearrange pages in your PDF documents' },
    { icon: '✂️', name: 'Split PDF', desc: 'Split PDF files into separate documents' },
    { icon: '🗜️', name: 'Compress PDF', desc: 'Reduce PDF file size while maintaining quality' },
  ];

  return (
    <div id="merge-pdf" className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📄</div>
            <h1>Add PDF Files Here</h1>
            <p>Drop your PDF files anywhere to start merging</p>
          </div>
        </div>
      )}

      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>📎 Merge PDF Files Online Free</h1>
            <p>Combine multiple PDF documents into a single file instantly. Perfect for reports, contracts, and document organization.</p>
            <div className="tool-badges">
              <span className="badge">✓ No Upload Required</span>
              <span className="badge">✓ Preserve Quality</span>
              <span className="badge">✓ Fast Processing</span>
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
                multiple
                accept=".pdf"
                onChange={handleFileInput}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div className="drop-icon">📄</div>
              <h2>Drop PDF files here or click to browse</h2>
              <p>Supports PDF files • multiple files allowed • drag to reorder</p>
            </div>

            {files.length > 0 && (
              <div id="preview-section">
                <h3>Selected PDFs ({files.length})</h3>
                <div className="pdf-list">
                  {files.map((file, idx) => (
                    <div key={idx} className="pdf-item">
                      <div className="pdf-info">
                        <div className="pdf-icon">📄</div>
                        <div className="pdf-details">
                          <div className="fname">{file.name}</div>
                          <div className="fsize">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <div className="pdf-actions">
                        {idx > 0 && (
                          <button
                            className="move-btn"
                            onClick={() => moveFile(idx, idx - 1)}
                            title="Move up"
                          >
                            ⬆️
                          </button>
                        )}
                        {idx < files.length - 1 && (
                          <button
                            className="move-btn"
                            onClick={() => moveFile(idx, idx + 1)}
                            title="Move down"
                          >
                            ⬇️
                          </button>
                        )}
                        <button className="remove-btn" onClick={() => removeFile(idx)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="reorder-tip">💡 Tip: Use the arrow buttons to reorder files before merging</p>
              </div>
            )}

            {merging && (
              <div id="progress-wrap">
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: '75%' }} />
                </div>
                <p className="progress-label">Merging PDFs…</p>
              </div>
            )}

            <div className="actions-row">
              <button
                className="btn-convert"
                onClick={mergePDFs}
                disabled={files.length < 2 || merging}
              >
                ⚡ Merge PDFs
              </button>
              {files.length > 0 && (
                <button className="btn-clear" onClick={clearAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>

            {downloadReady && mergedPDF && (
              <div className="download-section">
                <h3>✅ Merge Complete!</h3>
                <p>Merged {files.length} PDF files into {totalPages} total pages</p>
                <div className="download-info">
                  <div className="file-details">
                    <span className="dname">merged_document.pdf</span>
                    <span className="dsize">Size: {(mergedPDF.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button className="btn-download-all" onClick={downloadMergedPDF}>
                    ⬇️ Download Merged PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </article>

        <section className="tool-info">
          <Accordion title="Why use PDF Merger?" isOpen={false} content={
            <div>
              <p>Combine multiple PDF documents efficiently for:</p>
              <ul>
                <li>Merging reports, invoices, and documentation</li>
                <li>Creating comprehensive project portfolios</li>
                <li>Combining scanned documents into single files</li>
                <li>Organizing related documents for easy sharing</li>
                <li>Reducing file clutter while maintaining document integrity</li>
              </ul>
            </div>
          } />

          <Accordion title="How to use PDF Merger" isOpen={false} content={
            <div>
              <ol>
                <li>Drag and drop PDF files or click to select multiple files</li>
                <li>Reorder files using the up/down arrows if needed</li>
                <li>Click "Merge PDFs" to combine your documents</li>
                <li>Wait for the merge process to complete</li>
                <li>Download your merged PDF file</li>
              </ol>
              <p><strong>Tip:</strong> Files are merged in the order they appear in the list. Use the reorder buttons to arrange pages as needed.</p>
            </div>
          } />

          <Accordion title="FAQ" isOpen={false} content={
            <div>
              <div className="faq-item">
                <h4>What PDF formats are supported?</h4>
                <p>All standard PDF files are supported, including PDF 1.0 through PDF 2.0.</p>
              </div>
              <div className="faq-item">
                <h4>Is there a limit to the number of PDFs I can merge?</h4>
                <p>You can merge up to 50 PDF files at once. For larger batches, consider merging in smaller groups.</p>
              </div>
              <div className="faq-item">
                <h4>Will the quality of my PDFs be affected?</h4>
                <p>No, merging preserves the original quality and formatting of all PDF files.</p>
              </div>
              <div className="faq-item">
                <h4>Are my files secure?</h4>
                <p>Yes, all processing happens locally in your browser. Files are not uploaded to any server.</p>
              </div>
              <div className="faq-item">
                <h4>What's the maximum file size for each PDF?</h4>
                <p>Individual PDF files can be up to 100MB. Total combined size should not exceed 500MB.</p>
              </div>
            </div>
          } />
        </section>

        <RelatedPDFTools />
      </main>
    </div>
  );
}