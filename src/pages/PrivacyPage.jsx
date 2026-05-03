import { useSEO } from '../hooks/useSEO';
import '../styles/ContentPage.css';

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy - WebToolOcean',
    description: 'Read WebToolOcean\'s Privacy Policy to understand how we collect, use, and protect your information.',
    keywords: 'privacy policy, privacy, data protection',
    canonical: 'https://webtoolocean.com/privacy',
  });

  return (
    <div className="content-page">
      <main className="content-wrapper">
        <article className="content-article">
          <h1>Privacy Policy for WebToolOcean</h1>
          <p className="last-updated"><strong>Last Updated:</strong> March 9, 2026</p>

          <p>Welcome to WebToolOcean. Your privacy is important to us. This Privacy Policy document explains how we collect, use, and protect your information when you visit our website.</p>

          <section>
            <h2>1. Information We Collect</h2>
            <p>When you use our website, we may automatically collect certain information including:</p>
            <ul>
              <li>IP Address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Pages visited</li>
              <li>Date and time of visit</li>
            </ul>
            <p>This information helps us improve our services and enhance user experience.</p>
          </section>

          <section>
            <h2>2. Cookies</h2>
            <p>WebToolOcean uses cookies to store information about visitors' preferences and optimize the user experience.</p>
            <p>Cookies help us understand how visitors use our website and allow us to improve our content and services.</p>
            <p>You can disable cookies through your individual browser options.</p>
          </section>

          <section>
            <h2>3. Google Advertising Cookies</h2>
            <p>We may use Google Ads and other advertising partners to display advertisements.</p>
            <p>Google uses cookies such as the DoubleClick cookie to serve ads to users based on their visit to our website and other websites on the internet.</p>
            <p>Users may opt out of personalized advertising by visiting the following link:</p>
            <p><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">https://www.google.com/settings/ads</a></p>
          </section>

          <section>
            <h2>4. Third Party Privacy Policies</h2>
            <p>WebToolOcean's Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of third-party ad servers for more detailed information.</p>
          </section>

          <section>
            <h2>5. How We Use Your Information</h2>
            <p>The information we collect may be used in the following ways:</p>
            <ul>
              <li>To improve website performance</li>
              <li>To understand how users interact with our website</li>
              <li>To maintain security and prevent abuse</li>
              <li>To display relevant advertisements</li>
            </ul>
            <p>We do not sell, trade, or rent users' personal information to others.</p>
          </section>

          <section>
            <h2>6. Children's Information</h2>
            <p>Protecting children while using the internet is one of our priorities. WebToolOcean does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>
          </section>

          <section>
            <h2>7. Consent</h2>
            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
          </section>

          <section>
            <h2>8. Updates to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page.</p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, you may contact us through our <a href="/contact">contact page</a>.</p>
          </section>
        </article>
      </main>
    </div>
  );
}
