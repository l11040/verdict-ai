/**
 * API 클라이언트 설정
 * 환경 변수에서 base URL을 가져옵니다.
 */

export const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  if (!baseUrl) {
    console.warn('⚠️ VITE_BASE_URL이 설정되지 않았습니다. 기본값 http://localhost:3333을 사용합니다.');
    return 'http://localhost:3333';
  }
  
  // URL 끝의 슬래시 제거
  return baseUrl.replace(/\/+$/, '');
};

export const apiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
};

