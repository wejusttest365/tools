import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedImageTools from './RelatedImageTools';

export default function ImageToPdf() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

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

  const convertToPdf = async () => {
    if (files.length === 0) return;

    setConverting(true);

    try {
      const pdf = new jsPDF();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Calculate dimensions to fit A4 page
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgAspectRatio = img.width / img.height;
            const pageAspectRatio = pageWidth / pageHeight;

            let imgWidth, imgHeight;
            if (imgAspectRatio > pageAspectRatio) {
              // Image is wider than page ratio
              imgWidth = pageWidth;
              imgHeight = pageWidth / imgAspectRatio;
            } else {
              // Image is taller than page ratio
              imgHeight = pageHeight;
              imgWidth = pageHeight * imgAspectRatio;
            }

            // Center the image on the page
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            if (i > 0) {
              pdf.addPage();
            }

            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
            resolve();
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }

      const pdfBlob = pdf.output('blob');
      setPdfBlob(pdfBlob);
      setDownloadReady(true);
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('Error converting images to PDF. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const downloadPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_images_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadReady(false);
    setPdfBlob(null);
  };

  const imageTools = [
    { icon: '🗜️', name: 'Compress Images', desc: 'Reduce file size without losing quality' },
    { icon: '📝', name: 'Image to Text (OCR)', desc: 'Extract text from any image instantly' },
    { icon: '✏️', name: 'SVG to Image', desc: 'Convert SVG to PNG, JPG or WEBP' },
    { icon: '📄', name: 'PDF to Image', desc: 'Convert PDF pages to images' },
    { icon: '🎨', name: 'Image to SVG', desc: 'Vectorize raster images to scalable SVG' },
  ];

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Compress Images': '/image-compress',
      'Image to Text (OCR)': '/image-ocr',
      'SVG to Image': '/svg-to-image',
      'PDF to Image': '/pdf-to-image',
      'Image Converter': '/',
      'Image to SVG': '/image-to-svg'
    };
    return routeMap[toolName] || '#';
  };

  const infoBoxes = [
    {
      title: 'What is Image to PDF Converter?',
      content: 'An Image to PDF converter transforms your image files (JPG, PNG, WEBP, etc.) into a single PDF document. Each image becomes a separate page in the PDF, maintaining high quality while creating a professional document format. This tool runs entirely in your browser — your images are never uploaded to a server, keeping your data completely private and secure.'
    },
    {
      title: 'Supported Image Formats',
      content: 'JPG/JPEG, PNG, WEBP, GIF, BMP, TIFF, ICO — virtually any image format your browser can display can be converted to PDF. The converter automatically optimizes image dimensions to fit standard A4 pages while preserving aspect ratios.'
    },
    {
      title: 'How to Convert Images to PDF — Step by Step',
      content: 'Step 1: Drop your image files into the upload area, or click to browse. Step 2: Review the selected images in the preview area. Step 3: Click "Convert to PDF" to start the conversion. Step 4: Download your PDF document when ready.'
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Is this free? Yes — completely free. Are my images uploaded? No, everything happens in your browser. Can I convert multiple images? Yes! Each image becomes a separate page. What is the file size limit? There is no server-side limit.'
    },
  ];

  return (
    <div id="image-to-pdf" className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📁</div>
            <h1>Add Images Here</h1>
            <p>Drop your images to convert them to PDF</p>
          </div>
        </div>
      )}

      <main className="main-col">
        {/* Tool Hero */}
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>🖼️ Free Image to PDF Converter</h1>
            <p>Convert JPG, PNG, WEBP and more to PDF — free, instant, no signup</p>
            <div className="tool-badges">
              <span className="badge">Free</span>
              <span className="badge">No Upload</span>
              <span className="badge">High Quality</span>
            </div>
          </div>
        </article>

        {/* Upload Section */}
        <section className="upload-section">
          <div className="upload-area">
            <div
              className={`upload-dropzone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-content">
                <div className="upload-icon">📄</div>
                <h3>Drop images here or click to browse</h3>
                <p>Supports JPG, PNG, WEBP, GIF, BMP, TIFF, ICO</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" className="upload-btn">
                  Choose Images
                </label>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="file-list">
              <div className="file-list-header">
                <h4>Selected Images ({files.length})</h4>
                <button onClick={clearAll} className="clear-btn">Clear All</button>
              </div>
              <div className="file-items">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <div className="file-icon">🖼️</div>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button onClick={() => removeFile(index)} className="remove-btn">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Convert Button */}
          {files.length > 0 && !downloadReady && (
            <div className="convert-section">
              <button
                onClick={convertToPdf}
                disabled={converting}
                className="convert-btn"
              >
                {converting ? 'Converting...' : 'Convert to PDF'}
              </button>
            </div>
          )}

          {/* Download Section */}
          {downloadReady && (
            <div className="download-section">
              <div className="download-content">
                <div className="download-icon">✅</div>
                <h3>PDF Ready for Download</h3>
                <p>Your images have been successfully converted to PDF</p>
                <button onClick={downloadPdf} className="download-btn">
                  Download PDF
                </button>
                <button onClick={clearAll} className="convert-again-btn">
                  Convert More Images
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Info Boxes */}
        <section className="info-section">
          <div className="info-grid">
            {infoBoxes.map((box, index) => (
              <Accordion key={index} title={box.title} content={box.content} />
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedImageTools tools={imageTools} getToolRoute={getToolRoute} />
      </main>
    </div>
  );
}