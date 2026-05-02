import Menu from './Menu';
import '../styles/Header.css';

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header role="banner" className="header">
      <div className="header-inner">
        <a href="#" className="logo" aria-label="Web Tool Ocean – Home" onClick={() => setCurrentPage('converter')}>
          <span className="logo-icon">🌊</span>
          <span className="logo-text">WebTool<span>Ocean</span></span>
        </a>
        <Menu currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </header>
  );
}
