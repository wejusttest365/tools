import { useState } from 'react';
import Header from './components/Header';
import ImageConverter from './components/ImageConverter';
import ImageCompress from './components/ImageCompress';
import ImageOCR from './components/ImageOCR';
import ToolPlaceholder from './components/ToolPlaceholder';
import Footer from './components/Footer';
import './styles/Global.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('converter');

  const renderPage = () => {
    if (currentPage === 'compress') return <ImageCompress />;
    if (currentPage === 'ocr') return <ImageOCR />;
    if (currentPage === 'converter') return <ImageConverter />;
    return <ToolPlaceholder currentPage={currentPage} />;
  };

  return (
    <div className="app-container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="app-content">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
