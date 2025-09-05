import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignalsPage from './pages/SignalsPage';
import BrandPage from './pages/BrandPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/signals" replace />} />
            <Route path="/signals" element={<SignalsPage />} />
            <Route path="/brand" element={<BrandPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
