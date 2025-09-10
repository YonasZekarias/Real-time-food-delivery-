import { create } from "zustand";
import { fetchActiveDrivers } from "../../api/restaurant/activeDriver";

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error: "",

  getActiveDrivers: async (restaurantId) => {
    set({ loading: true, error: "" });
    try {
      const drivers = await fetchActiveDrivers(restaurantId);
      set({ drivers, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useDriverStore;
