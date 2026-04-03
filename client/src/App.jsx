import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import QuickFab from './components/QuickFab';

// Public pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import About from './pages/About';
import Review from './pages/Review';
import Policy from './pages/Policy';
import LegalPages from './pages/LegalPages';

// Auth pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Customer pages
import Reservation from './pages/Reservation';
import MyReservations from './pages/MyReservations';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import PrintMenu from './pages/admin/PrintMenu';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-[100dvh] overflow-x-hidden selection:bg-stone-800 selection:text-stone-50">
          <Routes>
            {/* ── Admin Portal (Isolated Layout) ── */}
            <Route
              path="/admin/print-menu"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PrintMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ── Main Site (Public Layout) ── */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public */}
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/impressions" element={<Review />} />
                      <Route path="/policy" element={<Policy />} />
                      <Route path="/legal" element={<LegalPages />} />

                      {/* Auth */}
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />

                      {/* Customer-protected */}
                      <Route
                        path="/reservation"
                        element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <Reservation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-reservations"
                        element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <MyReservations />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <QuickFab />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
