import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components';
import SignalsPage from './pages/SignalsPage';
import BrandPage from './pages/BrandPage';
import { ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SIGNALS} replace />} />
            <Route path={ROUTES.SIGNALS} element={<SignalsPage />} />
            <Route path={ROUTES.BRAND} element={<BrandPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
