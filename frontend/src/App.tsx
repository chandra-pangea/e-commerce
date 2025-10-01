import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* 🔹 Navbar (sticky at top) */}
      <header className="sticky top-0 z-50 shadow-md">
        <Navbar />
      </header>

      {/* 🔹 Main (takes full remaining height) */}
      <main className="flex-1 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <Routes>
            {/* 🔹 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* 🔹 User Routes (protected) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute role="USER">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute role="USER">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/confirmation"
              element={
                <ProtectedRoute role="USER">
                  <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center text-green-600 text-2xl font-semibold mt-10 border border-green-200">
                    Order Confirmed!
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute role="USER">
                  <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center text-blue-600 text-2xl font-semibold mt-10 border border-blue-200">
                    Profile Page (Coming Soon)
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute role="USER">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute role="USER">
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute role="USER">
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* 🔹 Admin Routes (protected) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute role="ADMIN">
                  <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center text-indigo-600 text-2xl font-semibold mt-10 border border-indigo-200">
                    Admin Products (Coming Soon)
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute role="ADMIN">
                  <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center text-indigo-600 text-2xl font-semibold mt-10 border border-indigo-200">
                    Admin Orders (Coming Soon)
                  </div>
                </ProtectedRoute>
              }
            />

            {/* 🔹 Catch-All 404 */}
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
      <footer className="mt-auto">
        <Footer />
      </footer>

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
  );
}

export default App;
