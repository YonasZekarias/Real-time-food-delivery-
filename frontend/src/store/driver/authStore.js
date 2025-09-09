import { create } from "zustand";
import { loginApi, logoutApi, refreshTokenApi, signupApi } from "../../api/customer/authApi";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  pendingUser: null, // { phone }

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
    const res = await refreshTokenApi();
    if (res.success) {
      set({ isLoggedIn: true, user: res.data });
    } else {
      set({ isLoggedIn: false, user: null });
    }
    return res;
  },

  // ------------------- SIGNUP -------------------
  signupUser: async (email, phone, password, role) => {
    const res = await signupApi(email, phone, password, role);
    if (res.success) {
      set({ pendingUser: { phone } });
    }
    return res;
  },

  // ------------------- SET PENDING PHONE -------------------
  setPendingPhone: (phone) => set({ pendingUser: { phone } }),
}));

export default useAuthStore;
