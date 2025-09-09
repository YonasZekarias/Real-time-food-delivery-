// API functions for driver orders
import axios from "axios";

export const fetchDriverOrdersAPI = async (driverId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/delivery/drivers/${driverId}/orders`,
      { withCredentials: true }
    );
    return res.data.data; // { driver, orders }
  } catch (err) {
    console.error("Fetch Driver Orders Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

export const updateDriverStatusAPI = async (status) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/delivery/drivers/status`,
      { status },
      { withCredentials: true }
    );
    return res.data.data.driver;
  } catch (err) {
    console.error("Update Driver Status Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

export const updateOrderStatusAPI = async (orderId, status) => {
  try {
    await axios.post(
      `http://localhost:5000/api/delivery/orders/${orderId}/status`,
      { status },
      { withCredentials: true }
    );
  } catch (err) {
    console.error("Update Order Status Error:", err.response?.data?.message || err.message);
    throw err;
  }
};
