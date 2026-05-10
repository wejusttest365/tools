import { useNavigate } from 'react-router-dom';

export default function RelatedImageTools() {
  const navigate = useNavigate();

  const relatedTools = [
    { icon: '🗜️', name: 'Image Compressor', link: '/image-compress' },
    { icon: '🔄', name: 'Image Converter', link: '/' },
    { icon: '🔤', name: 'Web Font Converter', link: '/web-font-converter' },
  ];

  const handleNavigate = (link) => {
    navigate(link);
    window.scrollTo(0, 0);
  };

  return (
    <section>
      <h2 className="section-title">🛠️ Related Image Tools</h2>
      <div className="shortcut-grid">
        {relatedTools.map((tool, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigate(tool.link)}
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
            <div className="sc-desc">{tool.name.replace('Image ', '').toLowerCase()}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
