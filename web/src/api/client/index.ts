/**
 * API 클라이언트 인스턴스 생성 및 export
 * 생성된 OpenAPI 클라이언트를 래핑하여 인터셉터와 설정을 적용합니다.
 */
import { Configuration } from '../generated/configuration';
import { AppApi, AuthApi } from '../generated/api';
import { axiosInstance } from './axios';
import { getApiBaseUrl } from './config';

// API Configuration 생성
const createApiConfiguration = (): Configuration => {
  return new Configuration({
    basePath: getApiBaseUrl(),
    baseOptions: {
      // Axios 인스턴스의 기본 설정을 상속
    },
  });
};

// API 클라이언트 인스턴스 생성
const apiConfig = createApiConfiguration();
const baseUrl = getApiBaseUrl();

// 각 API 클라이언트 인스턴스 생성
// BaseAPI 생성자: (configuration?, basePath?, axios?)
// axios 인스턴스를 전달하여 인터셉터가 적용된 인스턴스를 사용합니다
export const appApi = new AppApi(apiConfig, baseUrl, axiosInstance);
export const authApi = new AuthApi(apiConfig, baseUrl, axiosInstance);

// 모든 API 클라이언트를 하나의 객체로 export
export const api = {
  app: appApi,
  auth: authApi,
};

// 기본 export
export default api;

