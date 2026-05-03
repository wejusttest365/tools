import { useSEO } from '../hooks/useSEO';
import '../styles/ContentPage.css';

export default function ContactPage() {
  useSEO({
    title: 'Contact WebToolOcean',
    description: 'Contact WebToolOcean for support, feedback, or bug reports. Email: webtoolocean@gmail.com',
    keywords: 'contact, support, email',
    canonical: 'https://webtoolocean.com/contact',
  });

  return (
    <div className="content-page simple-page">
      <div className="page-banner">
        <div className="banner-content">
          <h1>Contact Us</h1>
          <p className="banner-subtitle">We'd love to hear from you</p>
        </div>
      </div>

      <main className="content-wrapper">
        <article className="content-article simple-article contact-simple">
          <section>
            <h2>Get In Touch</h2>
            <div className="simple-contact-box">
              <a href="mailto:webtoolocean@gmail.com" className="simple-contact-email">
                webtoolocean@gmail.com
              </a>
              <p>We respond to all emails within 24-48 hours</p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
