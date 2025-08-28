import { create } from "zustand";
import axios from "axios";

// ✅ Axios instance with cookies enabled
const api = axios.create({
  baseURL: "http://localhost:5000/api/delivery",
  withCredentials: true, // important for HttpOnly cookies
});

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  pendingUser: null, // for signup verification

  // Login
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      // ✅ Only store user info, token is in HttpOnly cookie
      set({ isLoggedIn: true, user: response.data.data });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Login failed",
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      // Optional: backend logout endpoint to clear cookie
      await api.post("/auth/logout");
    } catch {}
    set({ isLoggedIn: false, user: null, pendingUser: null });
  },

  // Check session / refresh
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/refresh-token");
      set({ isLoggedIn: true, user: res.data.data });
    } catch {
      set({ isLoggedIn: false, user: null });
    }
  },

  // Signup (optional, preserves your existing pendingUser flow)
  signupUser: async (email, phone, password, role) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        phone,
        password,
        role,
      });
      set({
        pendingUser: { id: response.data.data.userid, email, phone, role },
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Signup failed",
      };
    }
  },
}));

export default useAuthStore;
