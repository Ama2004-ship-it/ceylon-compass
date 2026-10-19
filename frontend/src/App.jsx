import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetails from './pages/PlaceDetails';
import Itinerary from './pages/Itinerary';
import MapView from './pages/MapView';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlaceForm from './pages/AdminPlaceForm';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/map" element={<MapView />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/places/new"
            element={
              <ProtectedRoute>
                <AdminPlaceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/places/:id/edit"
            element={
              <ProtectedRoute>
                <AdminPlaceForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
