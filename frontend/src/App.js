import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "./store/restaurant/authStore";

// Customer Pages
import { Login } from "./pages/customer/Login";
import Signup from "./pages/customer/Signup";
import ForgotPassword from "./pages/customer/ForgotPassword";
import ResetPassword from "./pages/customer/ResetPassword";
import { Landing_Page } from "./pages/customer/Landing Page";
import VerificationCode from "./components/VerificationCode";
import OrderHistory from "./pages/customer/OrderHistory";
import FeedbackPage from "./pages/customer/FeedBack";
import NearbyRestaurants from "./pages/customer/NearbyRestaurants";
import Sidebar from "./components/Sidebar";
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import OrderStatus from "./pages/customer/OrderStatus";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage";

// Restaurant Pages
import RestaurantSignup from "./pages/restaurant/Signup";
import RestaurantVerificationCode from "./components/restaurant/VerificationCode";
import RestaurantLogin from "./pages/restaurant/Login";
import Dashboard from "./pages/restaurant/Dashboard";
import AddMenuItem from "./pages/restaurant/MenuManager";
import MenuManagement from "./pages/restaurant/MenuManagementpage";
import InventoryPage from "./pages/restaurant/InventoryPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RestaurantManagement from "./pages/admin/RestaurantManagement";
import PendingRestaurants from "./pages/admin/PendingRestaurants";

function App() {
  const { checkAuth } = useAuthStore();

  // Check HTTP-only cookie auth on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Protected route wrapper with loading handling
  const PrivateRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, role, loading } = useAuthStore();

    if (loading)
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      );

    if (!isLoggedIn) return <Navigate to="/restaurant/login" replace />;
    if (allowedRoles && !allowedRoles.includes(role))
      return <Navigate to="/" replace />;

    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-white/90">
        <Routes>
          {/* Customer Pages */}
          <Route path="/" element={<Landing_Page />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerificationCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/nearby" element={<NearbyRestaurants />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/menu/:restaurantId" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/order-status" element={<OrderStatus />} />

          {/* Restaurant Pages */}
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/restaurant/signup" element={<RestaurantSignup />} />
          <Route
            path="/restaurant/verify"
            element={<RestaurantVerificationCode />}
          />

          <Route
            path="/restaurant/dashboard"
            element={
              <PrivateRoute allowedRoles={["restaurant"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant/menu"
            element={
              <PrivateRoute allowedRoles={["restaurant"]}>
                <AddMenuItem />
              </PrivateRoute>
            }
          />
          <Route
            path="/MenuManagement/:restaurantId"
            element={
              <PrivateRoute allowedRoles={["restaurant"]}>
                <MenuManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/:restaurantId"
            element={
              <PrivateRoute allowedRoles={["restaurant"]}>
                <InventoryPage />
              </PrivateRoute>
            }
          />

          {/* Admin Pages */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <RestaurantManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/restaurants/pending"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <PendingRestaurants />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
