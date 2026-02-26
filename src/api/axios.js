import axios from "axios";
import { tokenManager } from "../utils/tokenManager";
import { refreshAccessToken } from "./authApi";
import { API_URL } from "../Config";

const getBaseURL = () => {
  if (typeof API_URL !== 'undefined' && API_URL) return `${API_URL}/api`;

  // 만약 API_URL이 아직 정의되지 않았다면 현재 도메인 기반으로 즉석 생성
  if (window.location.hostname === "calmdesk.cloud" || window.location.hostname === "www.calmdesk.cloud") {
    return "https://api.calmdesk.cloud/api";
  }
  return "http://localhost:8080/api";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 토큰 갱신 공통 함수
const handleRefresh = async () => {
  if (tokenManager.isRefreshing()) {
    return new Promise((resolve) => {
      tokenManager.subscribeTokenRefresh(resolve);
    });
  }

  tokenManager.setRefreshing(true);
  try {
    const newAccessToken = await refreshAccessToken();
    tokenManager.setAccessToken(newAccessToken);
    tokenManager.onTokenRefreshed(newAccessToken);
    return newAccessToken;
  } catch (refreshError) {
    tokenManager.clearAccessToken();
    tokenManager.clearSubscribers();
    throw refreshError;
  } finally {
    tokenManager.setRefreshing(false);
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    // console.log("요청 시작:", config.url);
    let token = tokenManager.getAccessToken();

    // 토큰이 있고 만료된 경우 선제적으로 갱신
    if (token && tokenManager.isTokenExpired()) {
      console.log("토큰 만료 감지, 갱신 시도 중...");
      try {
        token = await handleRefresh();
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await handleRefresh();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
