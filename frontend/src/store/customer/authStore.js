import { create } from "zustand";
import {
  loginApi,
  logoutApi,
  refreshTokenApi,
  signupApi,
} from "../../api/customer/authApi";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  pendingUser: null,

  // ------------------- LOGIN -------------------
  login: async (email, password) => {
    const res = await loginApi(email, password);
    if (res.success) {
      set({ isLoggedIn: true, user: res.data });
    }
    return res;
  },

  // ------------------- LOGOUT -------------------
  logout: async () => {
    await logoutApi();
    set({ isLoggedIn: false, user: null, pendingUser: null });
  },

  // ------------------- CHECK SESSION -------------------
    checkAuth: async () => {
      set({ loading: true });
      const res = await refreshTokenApi();
      if (res.success) {
        const data = res.data;
        set({
          isLoggedIn: true,
          user: data,
          
        });
      } else {
        set({
          isLoggedIn: false,
          user: null,
          
        });
      }
      return res;
    },

  // ------------------- SIGNUP -------------------
  signupUser: async (email, phone, password, role) => {
    const res = await signupApi(email, phone, password, role);
    if (res.success) {
      set({
        pendingUser: {
          id: res.data.userid,
          email,
          phone,
          role,
        },
      });
    }
    return res;
  },
}));

export default useAuthStore;
