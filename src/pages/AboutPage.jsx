import { useSEO } from '../hooks/useSEO';
import '../styles/ContentPage.css';

export default function AboutPage() {
  useSEO({
    title: 'About WebToolOcean - Free Online Tools',
    description: 'WebToolOcean provides simple, free online tools for image conversion, PDF editing, CSS generation, and web development. Fast, secure, browser-based.',
    keywords: 'about WebToolOcean, online tools, free tools, image converter, PDF tools, CSS generator',
    canonical: 'https://webtoolocean.com/about',
  });

  return (
    <div className="content-page simple-page">
      <div className="page-banner">
        <div className="banner-content">
          <h1>About WebToolOcean</h1>
          <p className="banner-subtitle">Simple, fast, and free online tools for everyone</p>
        </div>
      </div>

      <main className="content-wrapper">
        <article className="content-article simple-article">
          <section>
            <h2>Who We Are</h2>
            <p>WebToolOcean is a free, browser-based platform providing essential online tools for image conversion, PDF editing, CSS generation, and web development utilities.</p>
            <p>We believe powerful tools should be accessible to everyone without paywalls, signups, or complexity.</p>
          </section>

          <section>
            <h2>Our Principles</h2>
            <ul className="simple-list">
              <li>100% Free – No hidden fees or premium features</li>
              <li>Privacy First – All processing happens in your browser</li>
              <li>No Installation – Works instantly in any modern browser</li>
              <li>Fast & Reliable – Optimized for performance</li>
            </ul>
          </section>

          <section className="simple-cta">
            <h2>Start Using Our Tools</h2>
            <p>Explore our full collection of online utilities today.</p>
            <a href="/" className="simple-cta-button">Go to Tools</a>
          </section>
        </article>
      </main>
    </div>
  );
}
