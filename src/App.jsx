import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ImageCompressPage from './pages/ImageCompressPage';
import ImageOCRPage from './pages/ImageOCRPage';
import SVGToImagePage from './pages/SVGToImagePage';
import WebFontConverterPage from './pages/WebFontConverterPage';
import AIThumbnailsPage from './pages/AIThumbnailsPage';
import ToolPage from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import './styles/Global.css';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-compress" element={<ImageCompressPage />} />
          <Route path="/image-ocr" element={<ImageOCRPage />} />
          <Route path="/svg-to-image" element={<SVGToImagePage />} />
          <Route path="/web-font-converter" element={<WebFontConverterPage />} />
          <Route path="/youtube-tools/ai-thumbnails" element={<AIThumbnailsPage />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
