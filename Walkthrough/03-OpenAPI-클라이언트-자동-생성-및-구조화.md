# OpenAPI 클라이언트 자동 생성 및 구조화

## 작업 일시
2025-01-27

## 개요
서버의 Swagger API를 기반으로 OpenAPI 클라이언트를 자동 생성하고, 구조화된 API 클라이언트 레이어를 구성하여 인터셉터와 환경 변수 기반 설정을 적용했습니다.

---

## 기술적 흐름

### 1. 서버 OpenAPI JSON 스펙 엔드포인트 추가

NestJS 서버에서 OpenAPI Generator가 사용할 수 있는 JSON 스펙 엔드포인트를 추가했습니다.

**구성 내용:**
- `SwaggerModule.serveSwaggerSetup()`을 사용하여 `/api-json` 엔드포인트 생성
- OpenAPI Generator가 직접 접근할 수 있는 JSON 형식의 스펙 제공

**주요 파일:**
- `server/src/main.ts` - Swagger 설정 및 JSON 엔드포인트 추가

```typescript
SwaggerModule.serveSwaggerSetup('api-json', app, document);
```

**기술적 결정:**
- Swagger UI와 별도로 JSON 스펙만 제공하는 엔드포인트 필요
- OpenAPI Generator는 URL에서 직접 스펙을 가져와야 함

---

### 2. OpenAPI 클라이언트 자동 생성 스크립트 작성

Node.js 기반 스크립트를 작성하여 OpenAPI 클라이언트를 자동으로 생성하도록 구성했습니다.

**기술 스택 선택:**
- **@openapitools/openapi-generator-cli**: OpenAPI Generator CLI
- **typescript-axios**: TypeScript + Axios 기반 클라이언트 생성
- **dotenv**: 환경 변수 관리

**구성 내용:**
- 환경 변수 기반 스펙 URL/경로 설정
- `VITE_BASE_URL`이 있으면 자동으로 `/api-json` 추가
- 서버 연결 확인 및 스펙 형식 검증
- 빌드 타임 처리 로직 (서버가 없어도 빌드 진행 가능)

**주요 파일:**
- `web/scripts/generate-api.mjs` - OpenAPI 클라이언트 생성 스크립트

**주요 기능:**
1. 환경 변수 우선순위:
   - `VITE_OPENAPI_SPEC_URL` (직접 URL 지정)
   - `VITE_OPENAPI_SPEC_PATH` (로컬 파일 경로)
   - `VITE_BASE_URL` (자동으로 `/api-json` 추가)

2. 스펙 검증:
   - URL 연결 확인
   - Content-Type 검증 (JSON/YAML)
   - 빌드 타임 예외 처리

3. 출력 디렉토리:
   - `src/api/generated` - 생성된 파일 저장

**기술적 결정:**
- Node.js 스크립트 선택 이유: 크로스 플랫폼 호환성, 환경 변수 처리 용이성
- 빌드 타임 예외 처리: Docker 빌드 시 서버가 없을 수 있으므로 경고만 출력하고 계속 진행

---

### 3. 개발 서버 실행 시 자동 생성 통합

`predev` 스크립트를 추가하여 개발 서버 실행 전 자동으로 API 클라이언트를 생성하도록 구성했습니다.

**구성 내용:**
- `package.json`에 `predev` 스크립트 추가
- 실패 시에도 개발 서버는 계속 실행 (서버가 아직 실행 중이 아닐 수 있음)

**주요 파일:**
- `web/package.json` - 스크립트 설정

```json
{
  "scripts": {
    "predev": "npm run api:generate || echo '⚠️  API 클라이언트 생성 실패 (서버가 실행 중이 아닐 수 있습니다)'",
    "api:generate": "node scripts/generate-api.mjs"
  }
}
```

**기술적 결정:**
- `predev` 사용: npm의 라이프사이클 훅 활용
- 실패 허용: 서버가 먼저 실행되어야 하므로, 실패해도 개발 서버는 계속 실행

---

### 4. API 클라이언트 구조화

생성된 OpenAPI 클라이언트를 래핑하여 인터셉터와 설정을 적용할 수 있는 구조를 구성했습니다.

**디렉토리 구조:**
```
web/src/api/
├── client/
│   ├── config.ts      # 환경 변수에서 base URL 가져오기
│   ├── axios.ts        # Axios 인스턴스 및 인터셉터 설정
│   └── index.ts        # API 클라이언트 인스턴스 생성
├── generated/          # OpenAPI Generator로 생성된 파일들
└── index.ts            # 통합 export
```

**주요 파일:**

#### `client/config.ts` - 환경 변수 기반 설정
- `VITE_BASE_URL` 환경 변수에서 base URL 가져오기
- 기본값: `http://localhost:3333`
- URL 끝의 슬래시 제거 처리

#### `client/axios.ts` - Axios 인스턴스 및 인터셉터
- **요청 인터셉터:**
  - `localStorage`에서 `accessToken` 자동 추가
  - 개발 환경에서 요청 로깅
  
- **응답 인터셉터:**
  - 개발 환경에서 응답 로깅
  - 401 에러 처리 (리프레시 토큰 로직 준비)
  - 에러 상세 로깅

#### `client/index.ts` - API 클라이언트 인스턴스 생성
- `Configuration` 객체 생성
- 생성된 API 클래스(`AppApi`, `AuthApi`)에 인터셉터가 적용된 axios 인스턴스 전달
- `BaseAPI` 생성자: `(configuration?, basePath?, axios?)` 형식 활용

**기술적 결정:**
- 생성된 클라이언트 래핑: OpenAPI Generator가 생성한 코드는 수정하지 않고, 래핑 레이어 추가
- Axios 인스턴스 전달: `BaseAPI` 생성자의 세 번째 인자로 커스텀 axios 인스턴스 전달
- 환경 변수 사용: Vite의 `import.meta.env` 활용

---

### 5. 의존성 추가

필요한 패키지를 `package.json`에 추가했습니다.

**추가된 패키지:**
- `axios`: HTTP 클라이언트 (생성된 API 클라이언트가 사용)
- `dotenv`: 환경 변수 로드 (생성 스크립트에서 사용)
- `@openapitools/openapi-generator-cli`: OpenAPI Generator CLI

**주요 파일:**
- `web/package.json` - 의존성 추가

---

## 최종 구조

### API 클라이언트 사용 방법

```typescript
// 기본 사용
import { api } from '@/api';

// 개별 API 사용
import { authApi, appApi } from '@/api';

// 예시: 로그인
const response = await authApi.authControllerLogin({ 
  email: 'user@example.com', 
  password: 'password' 
});
```

### 환경 변수 설정

`.env` 파일:
```env
VITE_BASE_URL=http://localhost:3333
```

### 자동 생성 프로세스

1. 개발 서버 실행: `npm run dev`
2. `predev` 스크립트 실행
3. `api:generate` 스크립트 실행
4. 서버에서 `/api-json` 엔드포인트 호출
5. OpenAPI Generator로 클라이언트 생성
6. 개발 서버 시작

---

## 주요 결정사항

1. **OpenAPI Generator CLI 사용**
   - 서버 스펙 변경 시 자동으로 클라이언트 업데이트 가능
   - 타입 안정성 보장

2. **구조화된 클라이언트 레이어**
   - 생성된 코드와 커스텀 로직 분리
   - 인터셉터를 통한 공통 로직 처리 (인증, 로깅, 에러 처리)

3. **환경 변수 기반 설정**
   - 개발/프로덕션 환경별 설정 용이
   - Vite의 환경 변수 시스템 활용

4. **자동화된 생성 프로세스**
   - 개발 서버 실행 시 자동 생성
   - 수동 작업 최소화

---

## 참고 사항

- 생성된 파일은 `src/api/generated`에 저장되며, `.gitignore`에 추가되어 Git에서 제외됩니다.
- 서버가 실행 중이 아니어도 빌드는 진행되지만, 최신 API 클라이언트는 생성되지 않습니다.
- 리프레시 토큰 로직은 TODO로 남겨두고, 추후 구현 예정입니다.

