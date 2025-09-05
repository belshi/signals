import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, ErrorBoundary, NetworkStatus } from './components';
import { ErrorProvider, LayoutProvider, SignalsProvider, BrandProvider, AccessibilityProvider } from './contexts';
import SignalsPage from './pages/SignalsPage';
import BrandPage from './pages/BrandPage';
import { ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <ErrorProvider maxErrors={5}>
      <AccessibilityProvider>
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
                    <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SIGNALS} replace />} />
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
                    <Route 
                      path={ROUTES.BRAND} 
                      element={
                        <ErrorBoundary
                          resetOnPropsChange={true}
                          onError={(error, errorInfo) => {
                            console.error('BrandPage error:', error, errorInfo);
                          }}
                        >
                          <BrandProvider>
                            <BrandPage />
                          </BrandProvider>
                        </ErrorBoundary>
                      } 
                    />
                  </Routes>
                </main>
              </ErrorBoundary>
            </div>
          </Router>
        </LayoutProvider>
      </AccessibilityProvider>
    </ErrorProvider>
  );
};

export default App;
