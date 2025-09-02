import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api/delivery",
  withCredentials: true, // send HTTP-only cookies automatically
});

export const loginApi = async (email, password) => {
  const res = await authApi.post("/auth/login", { email, password });
  return res.data; // { data: user, token? }
};

export const signupApi = async (payload) => {
  const res = await authApi.post("/restaurants/register", payload);
  return res.data;
};

export const checkAuthApi = async () => {
  const res = await authApi.get("/auth/refresh-token");
  return res.data;
};

export const logoutApi = async () => {
  await authApi.post("/auth/logout");
};
