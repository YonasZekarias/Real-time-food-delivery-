import { create } from "zustand";
import useAuthStore from "../customer/authStore";
import { fetchDriverEarningsAPI } from "../../api/driver/earnings";

const useDriverEarningsStore = create((set) => ({
  driverId: null,
  earnings: null,
  loading: true,
  error: "",

  init: async () => {
    set({ loading: true, error: "" });
    const { checkAuth } = useAuthStore.getState();
    try {
      const res = await checkAuth();
      if (res.success && res.data.role === "driver") {
        set({ driverId: res.data.userId });
      } else {
        set({ error: "Not authenticated as driver", loading: false });
      }
    } catch (err) {
      set({ error: "Failed to get driver info", loading: false });
    }
  },

  loadEarnings: async (driverId) => {
    set({ loading: true, error: "" });
    try {
      const data = await fetchDriverEarningsAPI(driverId);
      set({ earnings: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useDriverEarningsStore;
