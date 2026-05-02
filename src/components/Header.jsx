import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import '../styles/Header.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header role="banner" className="header">
      <div className="header-inner">
        <a href="#" className="logo" aria-label="Web Tool Ocean – Home" onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}>
          <span className="logo-icon">🌊</span>
          <span className="logo-text">WebTool<span>Ocean</span></span>
        </a>
        <Menu />
      </div>
    </header>
  );
}
