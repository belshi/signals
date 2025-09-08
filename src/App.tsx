import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, ErrorBoundary, NetworkStatus } from './components';
import { ErrorProvider, LayoutProvider, SignalsProvider, BrandsProvider, BrandGoalsProvider, BrandCompetitorsProvider } from './contexts';
import SignalsPage from './pages/SignalsPage';
import SignalDetailPage from './pages/SignalDetailPage';
import BrandsPage from './pages/BrandsPage';
import BrandPage from './pages/BrandPage';
import { ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <ErrorProvider maxErrors={5}>
      <LayoutProvider>
          <Router>
            <div className="min-h-screen flex">
              <NetworkStatus />
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  console.error('App-level error:', error, errorInfo);
                }}
              >
                <Sidebar />
                <main role="main" className="flex-1 sm:ml-20 pt-16 sm:pt-0">
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
                            <BrandGoalsProvider>
                              <BrandCompetitorsProvider>
                                <BrandPage />
                              </BrandCompetitorsProvider>
                            </BrandGoalsProvider>
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
                    <Route 
                      path={ROUTES.SIGNAL} 
                      element={
                        <ErrorBoundary
                          resetOnPropsChange={true}
                          onError={(error, errorInfo) => {
                            console.error('SignalDetailPage error:', error, errorInfo);
                          }}
                        >
                          <SignalsProvider>
                            <BrandsProvider>
                              <SignalDetailPage />
                            </BrandsProvider>
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
