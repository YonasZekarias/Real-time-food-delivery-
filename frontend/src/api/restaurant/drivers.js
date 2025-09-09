// src/api/restaurant/drivers.js
import axios from "axios";

export const registerDriver = async (driverData) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/delivery/drivers/register",
      driverData,
      { withCredentials: true } // HttpOnly cookie
    );

    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to register driver");
    }

    return res.data.data.user;
  } catch (err) {
    console.error("API Register Driver Error:", err.response?.data?.message || err.message);
    throw err;
  }
};
