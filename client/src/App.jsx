import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Footer from './components/footer/Footer';
import About from './components/about/About';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/product-detail/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />

      </Routes>
      <Footer />
    </>
  );
}
