import { create } from "zustand";

const useStore = create((set, get) => ({
  cartItems: [],
  addToCart: (item) => {
    const cart = get().cartItems;
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      set({
        cartItems: cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ cartItems: [...cart, { ...item, quantity: 1 }] });
    }
  },
  removeFromCart: (id) => {
    set({ cartItems: get().cartItems.filter((i) => i.id !== id) });
  },
  clearCart: () => set({ cartItems: [] }),

  address: "",
  paymentMethod: "cod",
  setAddress: (addr) => set({ address: addr }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  feedbackText: "",
  setFeedbackText: (text) => set({ feedbackText: text }),
  clearFeedback: () => set({ feedbackText: "" }),
}));

export default useStore;
