import { create } from "zustand";
import { loginApi, signupApi, checkAuthApi, logoutApi } from "../../api/restaurant/authApi";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  restaurantId: null,
  role: null,
  loading: true,
  pendingUser: null, // used for phone + OTP verification

  // ----- Set pending user (for phone + OTP) -----
  setPendingUser: (user) => set({ pendingUser: user }),

  // ----- Login -----
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await loginApi(email, password);
      const data = res.data;

      set({
        isLoggedIn: true,
        user: data,
        restaurantId: data.restaurantId || null,
        role: data.role || null,
        loading: false,
      });

      return { success: true };
    } catch (err) {
      set({ loading: false });
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Login failed",
      };
    }
  },

  // ----- Signup Restaurant -----
  signupRestaurant: async (email, phone, password, name, lng, lat, image) => {
    set({ loading: true });
    try {
      const payload = {
        email: String(email),
        phone: String(phone),
        password: String(password),
        name: String(name),
        image: String(image),
        location: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
      };

      const res = await signupApi(payload);

      set({
        pendingUser: {
          id: res.data._id,
          email: payload.email,
          phone: payload.phone,
          name: payload.name,
          image: payload.image,
        },
        loading: false,
      });

      return { success: true };
    } catch (err) {
      set({ loading: false });
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Signup failed",
      };
    }
  },

  // ----- Check Auth (refresh session) -----
  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await checkAuthApi();
      const data = res.data;

      set({
        isLoggedIn: true,
        user: data,
        restaurantId: data.restaurantId || null,
        role: data.role || null,
        loading: false,
      });
    } catch {
      set({
        isLoggedIn: false,
        user: null,
        restaurantId: null,
        role: null,
        loading: false,
      });
    }
  },

  // ----- Logout -----
  logout: async () => {
    set({ loading: true });
    try {
      await logoutApi(); // backend logout
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({
        isLoggedIn: false,
        user: null,
        restaurantId: null,
        role: null,
        pendingUser: null,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
