import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header, Footer } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { CreatePlacePage } from './pages/CreatePlacePage';
import { MyPlacesPage } from './pages/MyPlacesPage';
import { AdminAmenitiesPage } from './pages/AdminAmenitiesPage';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/place/:id" element={<PlaceDetailPage />} />

              {/* Protected Routes */}
              <Route
                path="/create-place"
                element={
                  <ProtectedRoute>
                    <CreatePlacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-places"
                element={
                  <ProtectedRoute>
                    <MyPlacesPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/amenities"
                element={
                  <ProtectedRoute>
                    <AdminAmenitiesPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
