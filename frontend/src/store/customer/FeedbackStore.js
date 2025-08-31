// src/store/FeedbackStore.js
import { create } from "zustand";

const useFeedbackStore = create((set) => ({
  feedbackText: "",

  // update feedback text
  setFeedbackText: (text) => set({ feedbackText: text }),

  // clear feedback text
  clearFeedback: () => set({ feedbackText: "" }),
}));

export default useFeedbackStore;
