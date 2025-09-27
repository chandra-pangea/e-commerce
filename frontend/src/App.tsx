import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Protected Route

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen p-4">
        <Routes>
          {/* 🔹 Public Routes */}
          <Route path="/" element={<></>} />
          <Route path="/login" element={<></>} />
          <Route path="/register" element={<></>} />
          <Route path="/products" element={<></>} />
          <Route path="/products/:id" element={<></>} />

          {/* 🔹 User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="USER">
                <></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="USER">
                <></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/confirmation"
            element={
              <ProtectedRoute role="USER">
                <></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="USER">
                <></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute role="USER">
                <></>
              </ProtectedRoute>
            }
          />

          {/* 🔹 Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="ADMIN">
                <></>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="ADMIN">
                <></>
              </ProtectedRoute>
            }
          />

          {/* 🔹 Catch-All 404 */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
