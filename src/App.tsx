import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import UserDetail from './pages/UserDetail';
import RoleManagement from './pages/RoleManagement';
import RoleDetail from './pages/RoleDetail';
import ServiceManagement from './pages/ServiceManagement';
import ServiceDetail from './pages/ServiceDetail';
import PermissionManagement from './pages/PermissionManagement';
import ResourceManagement from './pages/ResourceManagement';
import ResourceControl from './pages/ResourceControl';
import RoadEvents from './pages/RoadEvents';
import HistoryInquiry from './pages/HistoryInquiry';
import TrafficStats from './pages/TrafficStats';

// Component to handle root redirect
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MapView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* User Management Routes (super_admin only) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <UserDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Role Management Routes (super_admin only) */}
      <Route
        path="/roles"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <RoleManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles/:id"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <RoleDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Service Management Routes (super_admin only) */}
      <Route
        path="/services"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <ServiceManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <ServiceDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Permission Management Routes (super_admin only) */}
      <Route
        path="/permissions"
        element={
          <ProtectedRoute requireRole="super_admin">
            <MainLayout>
              <PermissionManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Resource Management Routes */}
      <Route
        path="/resource-management"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResourceManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-management/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResourceManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-management/:type/:subtype"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResourceManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Resource Control Routes */}
      <Route
        path="/resource-control"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResourceControl />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-control/:device/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResourceControl />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Road Events Routes */}
      <Route
        path="/road-events"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RoadEvents />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/road-events/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RoadEvents />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* History Inquiry Routes */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HistoryInquiry />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HistoryInquiry />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history/:category/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HistoryInquiry />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Traffic Statistics Routes */}
      <Route
        path="/traffic-stats"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TrafficStats />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/traffic-stats/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TrafficStats />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard or login */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
