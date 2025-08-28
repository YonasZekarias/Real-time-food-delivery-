// src/store/menuStore.js
import { create } from "zustand";
import { fetchMenuByRestaurantId } from "../../api/customer/menuApi";

const useMenuStore = create((set) => ({
  restaurantName: "",
  menuItems: [],
  loading: false,
  error: null,
  promoTopOffset: 0,

  fetchMenu: async (restaurantId) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchMenuByRestaurantId(restaurantId);
      console.log("=== MENU FETCH DEBUG ===");
      console.log("Restaurant ID:", restaurantId);
      console.log("Restaurant data:", data);
      console.log("Menu items:", data.menu);
      if (data.menu && data.menu.length > 0) {
        console.log("First menu item structure:", data.menu[0]);
      }
      
      set({
        restaurantName: data.name || "Restaurant",
        menuItems: data.menu || [],
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setPromoTopOffset: (offset) => set({ promoTopOffset: offset }),
}));

export default useMenuStore;
