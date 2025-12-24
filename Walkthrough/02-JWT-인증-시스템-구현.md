# JWT 인증 시스템 구현

## 작업 일시
2025-01-27

## 개요
NestJS 기반 JWT 토큰 인증 시스템 구현. 회원가입, 로그인, 리프레시 토큰 갱신 기능을 포함하며, Swagger API 문서화와 함께 완성.

---

## 기술적 흐름

### 1. 스키마 관리 방식 결정

**기술적 결정:**
- TypeORM의 `synchronize: false`로 설정하여 모든 스키마 변경을 마이그레이션으로 관리
- 개발 환경과 프로덕션 환경 모두 마이그레이션을 통한 일관된 스키마 관리

**변경 내용:**
- `database.config.ts`에서 `synchronize: false` 설정
- `data-source.ts`는 이미 `false`로 설정되어 있음

---

### 2. JWT 인증 시스템 구현

#### 기술 스택 선택
- **@nestjs/jwt**: JWT 토큰 생성 및 검증
- **@nestjs/passport**: Passport 통합 (Local, JWT 전략)
- **passport-local**: 이메일/비밀번호 기반 인증
- **passport-jwt**: JWT 토큰 기반 인증
- **bcrypt**: 비밀번호 해싱
- **class-validator, class-transformer**: DTO 검증

#### 구조 설계

**모듈 구성:**
- **UserModule**: 사용자 데이터 관리
- **AuthModule**: 인증 로직 관리

**엔티티:**
- `User`: 사용자 정보 (id, email, password)

**서비스:**
- `UserService`: 사용자 CRUD, 비밀번호 검증
- `AuthService`: 로그인, 회원가입, 사용자 검증

**전략 (Passport):**
- `LocalStrategy`: 이메일/비밀번호 검증
- `JwtStrategy`: JWT 토큰 검증

**Guards:**
- `LocalAuthGuard`: 로그인 엔드포인트 보호
- `JwtAuthGuard`: 인증이 필요한 엔드포인트 보호

**DTOs:**
- `LoginDto`: 로그인 요청 데이터 (email, password)
- `RegisterDto`: 회원가입 요청 데이터 (email, password)

#### 구현 내용
- 회원가입: 이메일 중복 체크, 비밀번호 해싱, 사용자 생성
- 로그인: 이메일/비밀번호 검증, JWT 토큰 발급
- JWT 토큰: 24시간 만료, Bearer 토큰 방식

---

### 3. API 문서화 (Swagger)

**구성 내용:**
- Swagger UI 설정 (`/api` 경로)
- DTOs에 `@ApiProperty` 데코레이터 추가
- Controller에 `@ApiTags`, `@ApiOperation`, `@ApiResponse` 추가
- Bearer 인증 스키마 추가

**접속 방법:**
- 서버 실행 후 `http://localhost:3333/api`에서 API 문서 확인
- Swagger UI에서 직접 API 테스트 가능

---

### 4. 리프레시 토큰 시스템 추가

#### 기술적 결정
- Access Token과 Refresh Token 분리
- Refresh Token을 DB에 저장하여 토큰 무효화 지원
- 토큰 갱신 시 새로운 Refresh Token 발급 (Token Rotation)

**구현 내용:**
- User 엔티티에 `refreshToken` 필드 추가 (VARCHAR(500), nullable)
- Access Token: 24시간 만료
- Refresh Token: 7일 만료
- `/auth/refresh` 엔드포인트 추가
- Refresh Token 검증 및 새 토큰 발급 로직

**토큰 갱신 흐름:**
1. 클라이언트가 refresh_token 전송
2. 서버에서 refresh_token 검증 (JWT 서명 + DB 저장값 확인)
3. 새로운 access_token과 refresh_token 발급
4. 새로운 refresh_token을 DB에 저장

---

### 5. 사용자 필드 확장

#### 고유 UID 추가

**기술적 결정:**
- nanoid를 사용한 12자리 고유 ID 생성
- BeforeInsert 훅에서 자동 생성

**구현 내용:**
- User 엔티티에 `uid` 필드 추가 (VARCHAR(12), unique)
- `@BeforeInsert()` 훅에서 nanoid로 자동 생성
- 외부 노출용 식별자로 사용 (id는 내부용)

#### 닉네임 필드 추가

**구현 내용:**
- User 엔티티에 `nickname` 필드 추가
- RegisterDto에 nickname 필드 추가 (1-20자 제한)
- 회원가입 시 닉네임 입력 받음

---

### 6. 타입 안전성 개선

**문제:**
- TypeScript의 엄격한 타입 체크로 인한 타입 오류 발생
- Passport 전략의 반환 타입 추론 문제

**해결 방법:**
- `UserWithoutPassword` 타입 정의 (password 필드 제외)
- AuthService, LocalStrategy, AuthController의 타입 명시
- ESLint 설정 조정 (`@typescript-eslint/no-unsafe-member-access` 규칙 조정)

---

### 7. 마이그레이션 생성

**엔티티 변경사항:**
- id (INT, PK, Auto Increment)
- uid (VARCHAR(12), unique)
- email (VARCHAR, unique)
- password (VARCHAR)
- nickname (VARCHAR)
- refreshToken (VARCHAR(500), nullable)
- createdAt (TIMESTAMP, default CURRENT_TIMESTAMP)
- updatedAt (TIMESTAMP, default CURRENT_TIMESTAMP, onUpdate CURRENT_TIMESTAMP)

**마이그레이션 내용:**
- users 테이블 생성
- uid, email에 unique 인덱스 추가 (IDX_USERS_UID, IDX_USERS_EMAIL)
- refreshToken 필드 타입 명시 (VARCHAR(500)로 지정하여 TypeORM 오류 해결)
- down() 메서드로 롤백 지원

---

## 최종 구성

### API 엔드포인트

**POST /auth/register**
- 요청: `{ email: string, password: string, nickname: string }`
- 응답: `{ access_token: string, refresh_token: string, user: {...} }`

**POST /auth/login**
- 요청: `{ email: string, password: string }`
- 응답: `{ access_token: string, refresh_token: string }`

**POST /auth/refresh**
- 요청: `{ refresh_token: string }`
- 응답: `{ access_token: string, refresh_token: string }`

### 사용자 엔티티 구조

```
User {
  id: number (PK, Auto Increment)
  uid: string (Unique, 12자리, nanoid로 자동 생성)
  email: string (Unique)
  password: string (bcrypt 해시)
  nickname: string
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date
}
```

### 토큰 관리

- **Access Token**: JWT, 24시간 만료
- **Refresh Token**: JWT, 7일 만료, DB에 저장
- **Token Rotation**: refresh 시 새 refresh_token 발급

### 환경 변수

```
JWT_SECRET=your-secret-key-change-this-in-production
```

---

## 기술적 결정사항 요약

1. **스키마 관리**: synchronize: false, 마이그레이션으로 관리
2. **인증 방식**: JWT + Passport 전략 (Local, JWT)
3. **토큰 관리**: Access/Refresh Token 분리, Refresh Token DB 저장
4. **고유 식별자**: nanoid를 사용한 12자리 UID 자동 생성
5. **API 문서화**: Swagger 통합
6. **타입 안전성**: TypeScript 타입 명시 및 ESLint 설정 조정

---

## 파일 구조

```
server/
├── src/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── refresh-token.dto.ts
│   │   │   ├── strategies/
│   │   │   │   ├── local.strategy.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── guards/
│   │   │       ├── local-auth.guard.ts
│   │   │       └── jwt-auth.guard.ts
│   │   └── user/
│   │       ├── user.module.ts
│   │       └── user.service.ts
│   └── main.ts
└── migrations/
    └── 1737782400000-CreateUserTable.ts
```

