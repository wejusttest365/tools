import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer role="contentinfo" className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              WebTool<span>Ocean</span>
            </div>
            <p>
              Free online tools for PDF editing, image conversion, CSS generation, developer utilities and more. Fast, secure and browser-based — no downloads required.
            </p>
            <a href="mailto:webtoolocean@gmail.com" className="footer-email" aria-label="Email Web Tool Ocean">
              ✉️ webtoolocean@gmail.com
            </a>
          </div>

          {/* Image Tools */}
          <div className="footer-col">
            <h4>Image Tools</h4>
            <ul>
              <li><Link to="/">Image Converter</Link></li>
              <li><Link to="/image-compress">Compress Images</Link></li>
              <li><Link to="/image-ocr">Image to Text OCR</Link></li>
              <li><Link to="/tool/favicon">Favicon Generator</Link></li>
              <li><Link to="/tool/image-to-base64">Image to Base64</Link></li>
              <li><Link to="/svg-to-image">SVG to Image</Link></li>
            </ul>
          </div>

          {/* CSS & Dev Tools */}
          <div className="footer-col">
            <h4>CSS & Dev Tools</h4>
            <ul>
              <li><Link to="/tool/css-beautify">CSS Formatter</Link></li>
              <li><Link to="/tool/gradient-generator">Gradient Generator</Link></li>
              <li><Link to="/tool/box-shadow">Box Shadow Generator</Link></li>
              <li><Link to="/tool/json-formatter">JSON Formatter</Link></li>
              <li><Link to="/tool/html-formatter">HTML Formatter</Link></li>
              <li><Link to="/tool/font-converter">Font Converter</Link></li>
            </ul>
          </div>

          {/* PDF Tools & Info */}
          <div className="footer-col">
            <h4>PDF Tools & Info</h4>
            <ul>
              <li><Link to="/tool/merge-pdf">Merge PDF</Link></li>
              <li><Link to="/tool/compress-pdf">Compress PDF</Link></li>
              <li><Link to="/tool/split-pdf">Split PDF</Link></li>
              <li><Link to="/tool/reorder-pdf">Reorder PDF Pages</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><a href="#terms">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© Copyright 2026 Web Tool Ocean | Made With ❤️</p>
          <nav aria-label="Legal navigation">
            <Link to="/about">About</Link>
            <a href="#disclaimer">Disclaimer</a>
            <Link to="/privacy">Privacy</Link>
            <a href="#terms">Terms</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
