# NestJS + MariaDB 로컬 개발 환경 구성

## 작업 일시
2025-01-27

## 개요
NestJS와 MariaDB를 이용한 서버 설계 및 로컬 개발 환경 구성. Docker를 사용하여 MariaDB만 컨테이너로 실행하고, 서버는 로컬에서 직접 실행하도록 구성.

---

## 기술적 흐름

### 1. 프로젝트 초기화 및 데이터베이스 연결 설정

NestJS 프로젝트를 초기화하고 MariaDB와의 연결을 구성했습니다.

**기술 스택 선택:**
- **TypeORM**: 데이터베이스 ORM으로 선택
- **@nestjs/config**: 환경 변수 관리
- **@nestjs/typeorm**: NestJS와 TypeORM 통합

**구성 내용:**
- NestJS 프로젝트 초기화 (server 디렉토리)
- TypeORM을 사용한 MariaDB 연결 설정
- 환경 변수 기반 데이터베이스 설정 (`src/config/database.config.ts`)
- 기본 프로젝트 구조 생성 (entities, modules, common)

**주요 파일:**
- `server/src/config/database.config.ts` - 데이터베이스 설정 모듈
- `server/src/app.module.ts` - TypeORM 및 Config 모듈 통합

---

### 2. TypeORM 마이그레이션 시스템 구성

데이터베이스 스키마 관리를 위한 TypeORM 마이그레이션 시스템을 구성했습니다.

**구성 내용:**
- `data-source.ts` 파일 생성 (TypeORM CLI용 DataSource 설정)
- 마이그레이션 스크립트 추가 (generate, create, run, revert, show)
- migrations 디렉토리 생성

**기술적 결정:**
- 마이그레이션을 통한 스키마 버전 관리
- `synchronize: false`로 설정하여 모든 환경에서 마이그레이션을 통한 스키마 관리
- database.config.ts와 data-source.ts 모두 synchronize: false 설정

---

### 3. Docker 환경 구성 및 아키텍처 진화

#### 초기 구성
서버와 MariaDB를 모두 Docker로 실행하도록 구성했습니다.

**초기 구조:**
- Dockerfile (프로덕션 빌드용 멀티 스테이지)
- Dockerfile.dev (개발 환경용)
- docker-compose.yml (서버 + MariaDB)
- docker-compose.dev.yml (개발 환경 오버라이드)

#### 아키텍처 변경 결정

**결정 사항:** 서버는 로컬에서 실행, MariaDB만 Docker로 실행

**변경 이유:**
- 로컬 개발 시 hot reload 및 디버깅 편의성
- 개발 환경 단순화
- 불필요한 Docker 빌드 시간 제거

**변경 내용:**
- docker-compose.dev.yml 삭제
- docker-compose.yml에서 server 서비스 제거 (MariaDB만 포함)
- Dockerfile, Dockerfile.dev 삭제

**최종 docker-compose.yml 구조:**
```yaml
services:
  mariadb:
    image: mariadb:11
    ports:
      - "${DB_PORT:-3306}:3306"
    # MariaDB만 포함
```

---

### 4. 환경 변수 관리 전략 진화

#### 초기: .env.local 사용
- .env.local 파일 우선 읽기 설정
- docker-compose.yml에 env_file: .env.local 추가
- main.ts에서 dotenv로 .env.local 우선 로드

#### 최종 결정: .env 파일 단일 사용

**변경 이유:**
- Docker Compose는 기본적으로 `.env` 파일을 자동으로 읽어 변수 치환에 사용
- `.env.local`은 `env_file`로만 사용되어 docker-compose.yml의 변수 치환에는 사용되지 않음
- 단일 환경 변수 파일로 관리 단순화

**변경 내용:**
- docker-compose.yml에서 `env_file` 제거
- main.ts, app.module.ts에서 .env만 사용하도록 수정
- ports를 `${DB_PORT:-3306}:3306`으로 변경하여 .env 파일의 DB_PORT 사용

**기술적 학습:**
Docker Compose의 환경 변수 처리 방식 이해:
- `.env` 파일: 자동으로 읽어서 `${VAR}` 변수 치환에 사용
- `env_file`: 컨테이너 내부 환경 변수로만 사용

---

### 5. 중요한 기술적 문제 해결

#### mysql2 패키지 누락
**문제:** `DriverPackageNotInstalledError: Mysql package has not been found installed`

**원인:** TypeORM은 MariaDB를 MySQL 드라이버로 사용하므로 mysql2 패키지가 필요

**해결:** package.json에 mysql2 패키지 추가

**기술적 학습:**
- TypeORM의 MariaDB 지원 방식: MySQL 드라이버 사용
- 필요한 의존성 패키지 명확화

---

## 최종 구성

### 파일 구조
```
server/
├── docker-compose.yml (MariaDB만 포함)
├── src/
│   ├── config/
│   │   └── database.config.ts
│   ├── app.module.ts
│   └── main.ts
├── data-source.ts
├── .env (사용자가 생성 필요)
└── .env.example
```

### 환경 변수 설정 (.env)
```env
DB_HOST=localhost
DB_PORT=3336
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=verdict_db
PORT=3333
NODE_ENV=development
```

### 사용 방법

1. **MariaDB 시작:**
```bash
cd server
docker-compose up -d
```

2. **마이그레이션 실행:**
```bash
cd server
npm run migration:run
```

3. **서버 실행:**
```bash
cd server
npm install
npm run start:dev
```

---

## 기술적 결정사항 요약

1. **로컬 개발 환경 아키텍처:** 서버는 로컬 실행, MariaDB만 Docker로 실행
2. **환경 변수 관리:** .env 파일 단일 사용 (Docker Compose 자동 읽기 활용)
3. **의존성:** mysql2 패키지 추가 (TypeORM MariaDB 드라이버)
4. **포트 설정:** .env 파일의 DB_PORT를 docker-compose.yml에서 직접 사용
5. **스키마 관리:** synchronize: false로 설정하여 모든 스키마 변경은 마이그레이션으로 관리

