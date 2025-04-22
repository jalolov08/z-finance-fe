import axios from "axios";
import { message } from "antd";
import { useAuthStore } from "../zustand/useAuthStore";
import { API } from "../config/config";

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("token");

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        useAuthStore.getState().clearUser();
        message.error("Ваша сессия истекла.");
        return Promise.reject(error);
      }

      try {
        const { data } = await api.post("/user/refresh-token", {
          refreshToken,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        useAuthStore.getState().clearUser();
        message.error("Ваша сессия истекла.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
