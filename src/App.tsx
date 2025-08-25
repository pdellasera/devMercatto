import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import mobileRoutes from './mobile';
import { ThemeProvider } from './design-system/theme/ThemeProvider';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Optional auth route component (shows login if not authenticated, but doesn't redirect)
interface OptionalAuthRouteProps {
  children: React.ReactNode;
}

const OptionalAuthRoute: React.FC<OptionalAuthRouteProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

// Public route component (redirects to dashboard if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Public dashboard - accessible without login */}
            <Route
              path="/dashboard"
              element={
                <OptionalAuthRoute>
                  <Dashboard />
                </OptionalAuthRoute>
              }
            />

            {/* Default redirect to dashboard */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Mobile routes */}
            <Route path={mobileRoutes.path as string} element={mobileRoutes.element}>
              {mobileRoutes.children?.map((child, idx) => (
                <Route
                  key={idx}
                  index={child.index as boolean | undefined}
                  path={child.path}
                  element={child.element as React.ReactElement}
                />)
              )}
            </Route>

            {/* Catch all route */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
