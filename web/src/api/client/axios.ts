/**
 * Axios 인스턴스 생성 및 인터셉터 설정
 */
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { apiConfig } from './config';

// Axios 인스턴스 생성
export const axiosInstance: AxiosInstance = axios.create(apiConfig);

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 요청 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 401 에러 처리 (토큰 만료 등)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 리프레시 토큰으로 새 액세스 토큰 발급 시도
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // TODO: 리프레시 토큰 API 호출
          // const response = await refreshAccessToken(refreshToken);
          // localStorage.setItem('accessToken', response.data.accessToken);
          // originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          // return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 실패 시 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // TODO: 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      }
    }
    
    // 에러 로깅
    if (import.meta.env.DEV) {
      console.error('❌ [API Response Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

