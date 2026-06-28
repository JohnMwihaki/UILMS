import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject bearer token
client.interceptors.request.use(
  (config) => {
    try {
      const persistedState = localStorage.getItem("auth-storage");
      if (persistedState) {
        const state = JSON.parse(persistedState);
        const token = state?.state?.accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Error reading auth state from localStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Queue for failed requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Interceptor to handle 401 Unauthorized
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login/") &&
      !originalRequest.url?.includes("/auth/refresh/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(client(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const persistedState = localStorage.getItem("auth-storage");
        if (persistedState) {
          const parsed = JSON.parse(persistedState);
          const refreshToken = parsed?.state?.refreshToken;

          if (refreshToken) {
            const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
              refresh: refreshToken,
            });

            const responseData = res.data.data || res.data;
            const newAccessToken = responseData.access;

            // Update localStorage
            parsed.state.accessToken = newAccessToken;
            localStorage.setItem("auth-storage", JSON.stringify(parsed));

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            isRefreshing = false;

            return client(originalRequest);
          }
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear auth and redirect
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default client;
