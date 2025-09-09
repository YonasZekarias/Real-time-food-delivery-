import axios from "axios";

export const fetchDriverEarningsAPI = async (driverId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/delivery/drivers/${driverId}/earnings`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    console.error("Fetch Driver Earnings Error:", err.response?.data?.message || err.message);
    throw err;
  }
};
