import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { StoreProvider } from '@/context/StoreContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Gallery from '@/pages/Gallery';
import DigitalFiles from '@/pages/DigitalFiles';
import FAQ from '@/pages/FAQ';
import Contact from '@/pages/Contact';
import Favorites from '@/pages/Favorites';
import Cart from '@/pages/Cart';
import Login from '@/pages/Login';
import AdminPanel from '@/pages/AdminPanel';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function ProtectedAdmin() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-brand-400">Carregando...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <AdminPanel />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogo" element={<Catalog />} />
                  <Route path="/produto/:id" element={<ProductDetail />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/galeria" element={<Gallery />} />
                  <Route path="/arquivos-digitais" element={<DigitalFiles />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/favoritos" element={<Favorites />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Login />} />
                  <Route path="/admin/painel" element={<ProtectedAdmin />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppFloat />
            </div>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
