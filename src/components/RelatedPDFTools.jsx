import { useNavigate } from 'react-router-dom';

export default function RelatedPDFTools() {
  const navigate = useNavigate();

  const relatedTools = [
    { icon: '📎', name: 'Merge PDF', desc: 'Combine multiple PDF files' },
    { icon: '🔄', name: 'Reorder PDF', desc: 'Rearrange PDF page order' },
    { icon: '✂️', name: 'Split PDF', desc: 'Split PDF into separate files' },
  ];

  const handleNavigate = (link) => {
    navigate(link);
    window.scrollTo(0, 0);
  };

  return (
    <section>
      <h2 className="section-title">🛠️ Related PDF Tools</h2>
      <div className="shortcut-grid">
        {relatedTools.map((tool, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigate(`/tool/${tool.name.toLowerCase().replace(/\s+/g, '-')}`)}
            className="shortcut-card"
            style={{
              background: 'none',
              border: '1px solid #ccc',
              cursor: 'pointer',
              padding: 10,
              borderRadius: 6,
              textAlign: 'left'
            }}
          >
            <div className="sc-icon">{tool.icon}</div>
            <div className="sc-name">{tool.name}</div>
            <div className="sc-desc">{tool.desc}</div>
          </button>
        ))}
      </div>
    </section>
  );
}