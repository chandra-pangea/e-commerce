import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './providers/CartContext';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-50 to-white">
          <header className="sticky top-0 z-50 shadow-md">
            <Navbar />
          </header>

          <main className="flex-1">
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Remove Protected Routes temporarily */}
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Catch-All 404 */}
                <Route
                  path="*"
                  element={
                    <h1 className="text-center mt-20 text-3xl text-red-600 font-bold">
                      404 - Page Not Found
                    </h1>
                  }
                />
              </Routes>
            </div>
          </main>

          <Footer />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
