import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';
import RelatedImageTools from './RelatedImageTools';

// Set the worker source for pdfjs
GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PdfToImage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState(92);
  const [dragOver, setDragOver] = useState(false);
  const [fullPageDrag, setFullPageDrag] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);

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
      const droppedFiles = Array.from(e.dataTransfer.files).filter(isPdfFile);
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

  const isPdfFile = (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(isPdfFile);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(isPdfFile);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const convertToImages = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setConvertedImages([]);

    try {
      const allImages = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          const imageDataUrl = canvas.toDataURL(`image/${outputFormat}`, quality / 100);
          allImages.push({
            dataUrl: imageDataUrl,
            fileName: `${file.name.replace('.pdf', '')}_page_${pageNum}.${outputFormat}`,
            pageNum,
            originalFile: file.name
          });
        }
      }

      setConvertedImages(allImages);
      setDownloadReady(true);
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      alert('Error converting PDF to images. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const downloadAllImages = () => {
    convertedImages.forEach((image, index) => {
      const link = document.createElement('a');
      link.href = image.dataUrl;
      link.download = image.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const downloadSingleImage = (image) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = image.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadReady(false);
    setConvertedImages([]);
  };

  const imageTools = [
    { icon: '🗜️', name: 'Compress Images', desc: 'Reduce file size without losing quality' },
    { icon: '📝', name: 'Image to Text (OCR)', desc: 'Extract text from any image instantly' },
    { icon: '✏️', name: 'SVG to Image', desc: 'Convert SVG to PNG, JPG or WEBP' },
    { icon: '📄', name: 'Image to PDF', desc: 'Convert images to PDF document' },
    { icon: '🎨', name: 'Image to SVG', desc: 'Vectorize raster images to scalable SVG' },
  ];

  const getToolRoute = (toolName) => {
    const routeMap = {
      'Compress Images': '/image-compress',
      'Image to Text (OCR)': '/image-ocr',
      'SVG to Image': '/svg-to-image',
      'Image to PDF': '/image-to-pdf',
      'Image Converter': '/',
      'Image to SVG': '/image-to-svg'
    };
    return routeMap[toolName] || '#';
  };

  const infoBoxes = [
    {
      title: 'What is PDF to Image Converter?',
      content: 'A PDF to Image converter extracts each page from your PDF document and converts them into individual image files. This is perfect for sharing PDF pages on social media, creating thumbnails, or when you need image versions of PDF content. The tool runs entirely in your browser — your PDFs are never uploaded to a server, keeping your data completely private and secure.'
    },
    {
      title: 'Supported Output Formats',
      content: 'PNG — Lossless quality with transparency support. JPG — Smaller file size, best for photos. WEBP — Modern format with excellent compression. Each page becomes a separate image file with high resolution output.'
    },
    {
      title: 'How to Convert PDF to Images — Step by Step',
      content: 'Step 1: Drop your PDF file into the upload area, or click to browse. Step 2: Choose your preferred output format (PNG, JPG, or WEBP). Step 3: Adjust quality settings if needed. Step 4: Click "Convert to Images" to start. Step 5: Download individual pages or all images at once.'
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Is this free? Yes — completely free. Are my PDFs uploaded? No, everything happens in your browser. Can I convert multi-page PDFs? Yes! Each page becomes a separate image. What is the file size limit? There is no server-side limit.'
    },
  ];

  return (
    <div id="pdf-to-image" className="page-wrap">
      {/* Full Page Drag Overlay */}
      {fullPageDrag && (
        <div className="full-page-drag-overlay">
          <div className="drag-overlay-content">
            <div className="drag-overlay-icon">📄</div>
            <h1>Add PDF Here</h1>
            <p>Drop your PDF to convert pages to images</p>
          </div>
        </div>
      )}

      <main className="main-col">
        {/* Tool Hero */}
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>📄 Free PDF to Image Converter</h1>
            <p>Convert PDF pages to PNG, JPG, WEBP — free, instant, no signup</p>
            <div className="tool-badges">
              <span className="badge">Free</span>
              <span className="badge">No Upload</span>
              <span className="badge">High Quality</span>
            </div>
          </div>
        </article>

        {/* Settings Section */}
        <section className="settings-section">
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="output-format">Output Format</label>
              <select
                id="output-format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
            <div className="setting-item">
              <label htmlFor="quality">Quality: {quality}%</label>
              <input
                type="range"
                id="quality"
                min="70"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

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
                <h3>Drop PDF here or click to browse</h3>
                <p>Supports PDF files only</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" className="upload-btn">
                  Choose PDF
                </label>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="file-list">
              <div className="file-list-header">
                <h4>Selected PDFs ({files.length})</h4>
                <button onClick={clearAll} className="clear-btn">Clear All</button>
              </div>
              <div className="file-items">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <div className="file-icon">📄</div>
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
                onClick={convertToImages}
                disabled={converting}
                className="convert-btn"
              >
                {converting ? 'Converting...' : 'Convert to Images'}
              </button>
            </div>
          )}

          {/* Results Section */}
          {downloadReady && convertedImages.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h3>Converted Images ({convertedImages.length})</h3>
                <button onClick={downloadAllImages} className="download-all-btn">
                  Download All
                </button>
              </div>
              <div className="image-grid">
                {convertedImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <div className="image-preview">
                      <img src={image.dataUrl} alt={`Page ${image.pageNum}`} />
                    </div>
                    <div className="image-info">
                      <span className="image-name">{image.fileName}</span>
                      <button
                        onClick={() => downloadSingleImage(image)}
                        className="download-single-btn"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="results-actions">
                <button onClick={clearAll} className="convert-again-btn">
                  Convert Another PDF
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