import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Footer from './components/footer/Footer';
import About from './components/about/About';

export default function App() {

  const location = useLocation();

  return (
    <>
      
      <Navbar />

      <AnimatePresence mode="wait">

        <Routes location={location} key={location.pathname}>
        
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/products/product-detail/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />

        </Routes>

      </AnimatePresence>



      <Footer />
    </>
  );
}
