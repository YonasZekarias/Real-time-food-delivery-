// src/store/restaurant/driverStore.js
import { create } from "zustand";
import { registerDriver as apiRegisterDriver } from "../../api/restaurant/drivers";
import useAuthStore from "./authStore";

const useDriverStore = create((set, get) => ({
  loading: false,
  message: "",
  error: null,

  registerDriver: async (driverData) => {
    const { restaurantId } = useAuthStore.getState();
    if (!restaurantId) {
      set({ error: "Restaurant ID not found. Please login again." });
      return;
    }

    set({ loading: true, message: "", error: null });
    try {
      const user = await apiRegisterDriver({ ...driverData, restaurantId });
      set({
        message: `Driver registered successfully: ${user.name || "No Name"}`,
        loading: false,
        error: null,
      });
      return user;
    } catch (err) {
      set({
        message: err.response?.data?.message || "Error registering driver",
        loading: false,
        error: err.message,
      });
    }
  },
}));

export default useDriverStore;
