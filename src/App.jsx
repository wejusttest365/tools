import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ImageCompressPage from './pages/ImageCompressPage';
import ImageOCRPage from './pages/ImageOCRPage';
import ToolPage from './pages/ToolPage';
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
          <Route path="/tool/:toolId" element={<ToolPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
