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
              <li><a href="#image-converter">Image Converter</a></li>
              <li><a href="#compress">Compress Images</a></li>
              <li><a href="#ocr">Image to Text OCR</a></li>
              <li><a href="#favicon">Favicon Generator</a></li>
              <li><a href="#base64">Image to Base64</a></li>
              <li><a href="#svg">SVG to Image</a></li>
            </ul>
          </div>

          {/* CSS & Dev Tools */}
          <div className="footer-col">
            <h4>CSS & Dev Tools</h4>
            <ul>
              <li><a href="#css">CSS Formatter</a></li>
              <li><a href="#gradient">Gradient Generator</a></li>
              <li><a href="#shadow">Box Shadow Generator</a></li>
              <li><a href="#json">JSON Formatter</a></li>
              <li><a href="#html">HTML Formatter</a></li>
              <li><a href="#font">Font Converter</a></li>
            </ul>
          </div>

          {/* PDF Tools & Info */}
          <div className="footer-col">
            <h4>PDF Tools & Info</h4>
            <ul>
              <li><a href="#merge">Merge PDF</a></li>
              <li><a href="#reorder">Reorder PDF Pages</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© Copyright 2026 Web Tool Ocean | Made With ❤️</p>
          <nav aria-label="Legal navigation">
            <a href="#about">About</a>
            <a href="#disclaimer">Disclaimer</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
