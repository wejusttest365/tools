import { Link } from 'react-router-dom';
import { footerNavGroups } from '../config/navigationConfig';
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

          {/* Dynamic Footer Columns */}
          {footerNavGroups.map((group) => (
            <div key={group.title} className="footer-col">
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to}>{item.label}</Link>
                    ) : (
                      <a href={item.href}>{item.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
