import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Landing_Page } from "./pages/Landing Page";
import VerificationCode from "./components/VerificationCode";
import OrderHistory from "./pages/OrderHistory";
import FeedbackPage from "./pages/FeedBack";
import NearbyRestaurants from "./pages/NearbyRestaurants";
import Sidebar from "./components/Sidebar";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
