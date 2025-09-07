import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, ErrorBoundary, NetworkStatus } from './components';
import { ErrorProvider, LayoutProvider, SignalsProvider, BrandsProvider } from './contexts';
import SignalsPage from './pages/SignalsPage';
import BrandsPage from './pages/BrandsPage';
import BrandPage from './pages/BrandPage';
import { ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <ErrorProvider maxErrors={5}>
      <LayoutProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <NetworkStatus />
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  console.error('App-level error:', error, errorInfo);
                }}
              >
                <Navbar />
                <main role="main">
                  <Routes>
                    <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.BRANDS} replace />} />
                    <Route 
                      path={ROUTES.BRANDS} 
                      element={
                        <ErrorBoundary
                          resetOnPropsChange={true}
                          onError={(error, errorInfo) => {
                            console.error('BrandsPage error:', error, errorInfo);
                          }}
                        >
                          <BrandsProvider>
                            <BrandsPage />
                          </BrandsProvider>
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path={ROUTES.BRAND} 
                      element={
                        <ErrorBoundary
                          resetOnPropsChange={true}
                          onError={(error, errorInfo) => {
                            console.error('BrandPage error:', error, errorInfo);
                          }}
                        >
                          <BrandsProvider>
                            <BrandPage />
                          </BrandsProvider>
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path={ROUTES.SIGNALS} 
                      element={
                        <ErrorBoundary
                          resetOnPropsChange={true}
                          onError={(error, errorInfo) => {
                            console.error('SignalsPage error:', error, errorInfo);
                          }}
                        >
                          <SignalsProvider>
                            <SignalsPage />
                          </SignalsProvider>
                        </ErrorBoundary>
                      } 
                    />
                  </Routes>
                </main>
              </ErrorBoundary>
            </div>
          </Router>
        </LayoutProvider>
    </ErrorProvider>
  );
};

export default App;
