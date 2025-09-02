// src/api/auth.js

export const verifyOTP = async ({ phone, otp }) => {
    try {
      const res = await fetch("https://real-time-food-delivery.onrender.com/api/delivery/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
        credentials: "include",
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed.");
      return data;
    } catch (err) {
      throw new Error(err.message || "Network error. Please try again.");
    }
  };
  