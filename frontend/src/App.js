import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import OrderStatus from "./pages/customer/OrderStatus"; // Assuming OrderStatus is also a customer-facing page and moved to the customer folder for consistency
import CheckoutPage from "./pages/customer/CheckoutPage";
import Navbar from "./components/Navbar"; // Included, though usage is commented out in Routes
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage";

// Restaurant specific pages
import Dashboard from "./pages/restaurant/Dashboard";
import MenuManagement from "./pages/restaurant/MenuManagementpage";
import Inventory from "./pages/restaurant/InventoryPage";

function App() {
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
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/order-status" element={<OrderStatus />} />

          {/* Restaurant Pages */}
          {/* <Navbar /> */} {/* If Navbar is needed for restaurant pages, uncomment and place within specific routes or a layout component */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/MenuManagement/:restaurantId"
            element={<MenuManagement />}
          />
          <Route path="/inventory/:restaurantId" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;