import { useState } from 'react';
import '../styles/Header.css';

export default function Menu({ currentPage, setCurrentPage }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});

  const navItems = [
    { id: 'home', label: 'Home', page: 'converter' },
    {
      id: 'image',
      label: 'Image Tools',
      submenu: [
        { label: 'Image Converter', page: 'converter' },
        { label: 'Compress Images', page: 'compress' },
        { label: 'Image to Text (OCR)', page: 'ocr' },
        { label: 'SVG to Image', page: 'svg-to-image' },
        { label: 'Image to SVG', page: 'image-to-svg' },
        { label: 'Favicon Generator', page: 'favicon' },
        { label: 'Image to Base64', page: 'base64' },
        { label: 'Base64 to Image', page: 'image-from-base64' },
      ],
    },
    {
      id: 'css',
      label: 'CSS Tools',
      submenu: [
        { label: 'Beautify / Minify CSS', page: 'css-beautify' },
        { label: 'Box Shadow Generator', page: 'box-shadow' },
        { label: 'Multi Box Shadow', page: 'multi-box-shadow' },
        { label: 'Clip Image CSS', page: 'clip-css' },
        { label: 'CSS Card Builder', page: 'card-builder' },
        { label: 'Gradient Generator', page: 'gradient-generator' },
      ],
    },
    {
      id: 'dev',
      label: 'Developer Tools',
      submenu: [
        { label: 'HTML Formatter', page: 'html-formatter' },
        { label: 'Check CSS Errors', page: 'css-errors' },
        { label: 'Base64 Encoder/Decoder', page: 'base64-codec' },
        { label: 'JSON Formatter', page: 'json-formatter' },
        { label: 'Web Font Converter', page: 'font-converter' },
      ],
    },
    {
      id: 'pdf',
      label: 'PDF Tools',
      submenu: [
        { label: 'Merge PDF', page: 'merge-pdf' },
        { label: 'Reorder PDF Pages', page: 'reorder-pdf' },
      ],
    },
  ];

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const toggleMobileDropdown = (id) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setMobileNavOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      <nav aria-label="Main navigation" className="desktop-nav">
        <ul className="nav-list" role="list">
          {navItems.map((item) => (
            item.submenu ? (
              <li key={item.id} className={`nav-item ${openDropdown === item.id ? 'open' : ''}`}>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => toggleDropdown(item.id)}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.id}
                >
                  {item.label}
                  <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <ul className="dropdown" role="menu" aria-label={`${item.label} submenu`}>
                  {item.submenu.map((subitem, idx) => (
                    <li key={idx} role="none">
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => goToPage(subitem.page)}
                      >
                        {subitem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id} className="nav-item">
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => goToPage(item.page)}
                  aria-current={currentPage === item.page ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            )
          ))}
        </ul>
      </nav>

      <div className="header-right">
        <button type="button" className="btn-contact" onClick={() => goToPage('contact')}>
          Contact
        </button>

        <button
          className={`hamburger ${mobileNavOpen ? 'open' : ''}`}
          id="hamburger-btn"
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileNavOpen}
      >
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    type="button"
                    className="mobile-nav-btn"
                    onClick={() => toggleMobileDropdown(item.id)}
                    aria-expanded={mobileDropdowns[item.id] || false}
                  >
                    {item.label}
                    <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <ul className={`mobile-dropdown ${mobileDropdowns[item.id] ? 'open' : ''}`}>
                    {item.submenu.map((subitem, idx) => (
                      <li key={idx}>
                        <button type="button" onClick={() => goToPage(subitem.page)}>
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <button type="button" className="mobile-nav-link" onClick={() => goToPage(item.page)}>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
