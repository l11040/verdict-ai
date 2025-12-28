/**
 * API 클라이언트 통합 export
 * 애플리케이션에서 사용할 API 클라이언트를 export합니다.
 */
export { api, appApi, authApi, stocksApi } from './client';
export { default as axiosInstance } from './client/axios';
export { getApiBaseUrl, apiConfig } from './client/config';

// 생성된 타입들도 export
export type * from './generated/api';
export type { Configuration } from './generated/configuration';
