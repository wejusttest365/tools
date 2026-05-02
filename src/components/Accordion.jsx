import { useState } from 'react';
import '../styles/Accordion.css';

export default function Accordion({ title, content, isOpen = false }) {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="accordion-item">
      <button
        className={`accordion-header ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="accordion-title">{title}</span>
        <svg className="accordion-icon" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="accordion-body">
          {content}
        </div>
      </div>
    </div>
  );
}