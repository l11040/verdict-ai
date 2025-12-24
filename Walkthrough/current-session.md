# 현재 세션 작업 내역

> 이 파일은 작업을 수행할 때마다 자동으로 업데이트됩니다.
> 롤백된 작업은 자동으로 제외됩니다.

## 세션 시작: 2025-01-27

> 이전 세션 작업 내역은 `NestJS-MariaDB-로컬-개발-환경-구성.md`에 저장되었습니다. (기술적 흐름 중심으로 재작성됨)

---

## 작업 내역

### 작업 1 - 2025-01-27

#### 요청 내용
현재 폴더에 여러개의 앱을 만들 예정이며, 먼저 NestJS와 MariaDB를 이용한 서버를 설계

#### 수행한 작업
- NestJS 프로젝트 초기화 (server 디렉토리)
- MariaDB 연결 설정 (TypeORM, @nestjs/typeorm, mariadb 패키지 설치)
- 환경 변수 설정 모듈 구성 (@nestjs/config)
- 데이터베이스 설정 파일 생성 (src/config/database.config.ts)
- AppModule에 ConfigModule과 TypeOrmModule 통합
- 기본 프로젝트 구조 생성 (entities, modules, common 디렉토리)
- .gitignore 파일 생성
- README.md에 데이터베이스 설정 가이드 추가
- 린터 오류 수정 (main.ts의 bootstrap 호출)

#### 생성/수정된 파일
- server/ (전체 NestJS 프로젝트)
  - server/src/app.module.ts (TypeORM 및 Config 모듈 통합)
  - server/src/main.ts (린터 오류 수정)
  - server/src/config/database.config.ts (새로 생성)
  - server/src/entities/ (디렉토리 생성)
  - server/src/modules/ (디렉토리 생성)
  - server/src/common/ (디렉토리 생성)
  - server/.gitignore (새로 생성)
  - server/README.md (데이터베이스 설정 가이드 추가)
  - server/package.json (의존성 추가: @nestjs/typeorm, typeorm, mariadb, @nestjs/config)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 2 - 2025-01-27

#### 요청 내용
기본 포트를 3333으로 변경

#### 수행한 작업
- main.ts의 기본 포트를 3000에서 3333으로 변경
- README.md의 .env 설정 예시에 PORT=3333 추가

#### 생성/수정된 파일
- server/src/main.ts (포트 기본값 변경: 3000 → 3333)
- server/README.md (PORT 설정 예시 추가)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 3 - 2025-01-27

#### 요청 내용
TypeORM 마이그레이션 구성

#### 수행한 작업
- data-source.ts 파일 생성 (마이그레이션 CLI용)
- database.config.ts에 migrations 경로 추가
- package.json에 마이그레이션 스크립트 추가 (generate, create, run, revert, show)
- migrations 디렉토리 생성
- README.md에 마이그레이션 사용 가이드 추가

#### 생성/수정된 파일
- server/data-source.ts (새로 생성 - TypeORM CLI용 DataSource 설정)
- server/src/config/database.config.ts (migrations 경로 추가)
- server/package.json (마이그레이션 스크립트 추가)
- server/migrations/ (디렉토리 생성)
- server/README.md (마이그레이션 사용 가이드 추가)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 4 - 2025-01-27

#### 요청 내용
DB 설정을 env로 할 예정이므로 .env.example 파일 생성

#### 수행한 작업
- .env.example 파일 생성 (데이터베이스 및 서버 설정 예시)

#### 생성/수정된 파일
- server/.env.example (새로 생성 - 환경 변수 예시 파일)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 5 - 2025-01-27

#### 요청 내용
로컬 개발 환경에서 Docker로 서버를 관리할 수 있도록 구성 (추후 Traefik 추가 예정)

#### 수행한 작업
- Dockerfile 생성 (프로덕션 빌드용 멀티 스테이지)
- Dockerfile.dev 생성 (개발 환경용)
- docker-compose.yml 생성 (NestJS 서버 + MariaDB)
- docker-compose.dev.yml 생성 (개발 환경 오버라이드)
- .dockerignore 파일 생성
- README.md에 Docker 사용 가이드 추가

#### 생성/수정된 파일
- server/Dockerfile (프로덕션 빌드용)
- server/Dockerfile.dev (개발 환경용)
- server/docker-compose.yml (NestJS + MariaDB 구성)
- server/docker-compose.dev.yml (개발 환경 오버라이드)
- server/.dockerignore (Docker 빌드 제외 파일 목록)
- server/README.md (Docker 사용 가이드 추가)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 6 - 2025-01-27

#### 요청 내용
.env.local 환경 변수를 사용하여 도커 실행하도록 구성

#### 수행한 작업
- docker-compose.yml에 env_file: .env.local 추가 (mariadb, server 서비스)
- docker-compose.dev.yml에 env_file: .env.local 추가
- AppModule에서 .env.local 파일 우선 읽기 설정
- .env.local.example 파일 생성
- .gitignore에 .env.local.example 제외 추가
- README.md에 .env.local 사용 가이드 업데이트

#### 생성/수정된 파일
- server/docker-compose.yml (env_file: .env.local 추가)
- server/docker-compose.dev.yml (env_file: .env.local 추가)
- server/src/app.module.ts (.env.local 우선 읽기 설정)
- server/.env.local.example (새로 생성)
- server/.gitignore (.env.local.example 제외 추가)
- server/README.md (.env.local 사용 가이드 업데이트)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 7 - 2025-01-27

#### 요청 내용
docker-compose.yml의 obsolete 경고 수정 (version 속성 제거)

#### 수행한 작업
- docker-compose.yml에서 `version: '3.8'` 제거
- docker-compose.dev.yml에서 `version: '3.8'` 제거

#### 생성/수정된 파일
- server/docker-compose.yml (version 속성 제거)
- server/docker-compose.dev.yml (version 속성 제거)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 8 - 2025-01-27

#### 요청 내용
failed to solve: target stage "development" could not be found 오류 수정

#### 수행한 작업
- docker-compose.dev.yml에서 `target: development` 제거
- Dockerfile.dev는 단일 스테이지 빌드이므로 target 지정 불필요

#### 생성/수정된 파일
- server/docker-compose.dev.yml (target: development 제거)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 9 - 2025-01-27

#### 요청 내용
TypeScript 컴파일 오류 수정 (process.env 타입 오류 및 useFactory 반환 타입 오류)

#### 수행한 작업
- data-source.ts에서 `process.env.DB_PORT`의 `undefined` 타입 처리 (기본값 '3306' 제공)
- database.config.ts에서 `process.env.DB_PORT`의 `undefined` 타입 처리 (기본값 '3306' 제공)
- app.module.ts에서 `configService.get('database')`의 타입 단언 추가 (TypeOrmModuleOptions 타입 명시)

#### 생성/수정된 파일
- server/data-source.ts (process.env.DB_PORT 타입 오류 수정)
- server/src/config/database.config.ts (process.env.DB_PORT 타입 오류 수정)
- server/src/app.module.ts (useFactory 반환 타입 오류 수정)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 10 - 2025-01-27

#### 요청 내용
DriverPackageNotInstalledError: Mysql package has not been found installed 오류 수정

#### 수행한 작업
- package.json에 mysql2 패키지 추가
- TypeORM은 MariaDB를 MySQL 드라이버로 사용하므로 mysql2 패키지가 필요함

#### 생성/수정된 파일
- server/package.json (mysql2 패키지 추가)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 11 - 2025-01-27

#### 요청 내용
ECONNREFUSED 오류 수정 (데이터베이스 연결 실패)

#### 수행한 작업
- docker-compose.dev.yml에 DB_HOST, DB_PORT 환경 변수 추가 (mariadb 서비스 이름 사용)
- depends_on 설정 추가 (MariaDB가 먼저 시작되도록)
- networks 설정 추가 (verdict-network에 연결)

#### 생성/수정된 파일
- server/docker-compose.dev.yml (DB_HOST, DB_PORT, depends_on, networks 추가)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 12 - 2025-01-27

#### 요청 내용
docker-compose.dev.yml을 로컬 개발용으로 변경 (MariaDB만 포함, 서버는 로컬에서 실행)

#### 수행한 작업
- docker-compose.dev.yml에서 server 서비스 제거
- MariaDB 서비스만 포함하도록 변경 (독립적으로 동작)
- volumes 및 networks 정의 추가
- 서버는 로컬에서 실행하고 MariaDB만 Docker로 실행하도록 구성

#### 생성/수정된 파일
- server/docker-compose.dev.yml (MariaDB만 포함하도록 재구성)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 13 - 2025-01-27

#### 요청 내용
docker-compose.dev.yml 삭제 및 docker-compose.yml을 로컬용으로만 사용하도록 변경

#### 수행한 작업
- docker-compose.dev.yml 파일 삭제
- docker-compose.yml에서 server 서비스 제거
- docker-compose.yml을 로컬 개발용 MariaDB만 포함하도록 변경
- 이 폴더는 오로지 로컬용 docker-compose만 사용

#### 생성/수정된 파일
- server/docker-compose.dev.yml (삭제됨)
- server/docker-compose.yml (server 서비스 제거, MariaDB만 포함)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 14 - 2025-01-27

#### 요청 내용
Dockerfile 삭제 (로컬 개발용으로만 사용하므로 불필요)

#### 수행한 작업
- Dockerfile 삭제
- Dockerfile.dev 삭제
- 로컬 개발 환경에서는 서버를 직접 실행하므로 Dockerfile 불필요

#### 생성/수정된 파일
- server/Dockerfile (삭제됨)
- server/Dockerfile.dev (삭제됨)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 15 - 2025-01-27

#### 요청 내용
.env.local 파일을 제대로 읽지 못하는 문제 수정

#### 수행한 작업
- main.ts에서 dotenv를 사용하여 .env.local 파일을 먼저 로드하도록 수정
- path.resolve를 사용하여 프로젝트 루트의 .env.local 파일을 명시적으로 로드
- .env 파일을 fallback으로 로드하도록 설정
- ConfigModule의 envFilePath보다 먼저 실행되어 환경 변수가 제대로 로드됨

#### 생성/수정된 파일
- server/src/main.ts (dotenv로 .env.local 우선 로드 추가)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 16 - 2025-01-27

#### 요청 내용
포트 3336이 docker-compose.yml에 적용되지 않는 문제 수정

#### 수행한 작업
- docker-compose.yml의 ports를 3336:3306으로 하드코딩
- Docker Compose는 기본적으로 .env 파일만 자동으로 읽어서 ${DB_PORT} 변수 치환에 사용
- .env.local의 DB_PORT는 env_file로만 사용되어 docker-compose.yml의 변수 치환에는 사용되지 않음
- 포트를 직접 지정하여 해결

#### 생성/수정된 파일
- server/docker-compose.yml (ports를 3336:3306으로 고정)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 17 - 2025-01-27

#### 요청 내용
.env.local 제거 및 .env 파일만 사용하도록 변경

#### 수행한 작업
- docker-compose.yml에서 env_file: .env.local 제거
- docker-compose.yml의 ports를 ${DB_PORT:-3306}:3306으로 변경 (.env 파일의 DB_PORT 사용)
- main.ts에서 .env.local 제거하고 .env만 사용하도록 수정
- app.module.ts에서 .env.local 제거하고 .env만 사용하도록 수정
- Docker Compose는 기본적으로 .env 파일을 자동으로 읽어서 변수 치환에 사용

#### 생성/수정된 파일
- server/docker-compose.yml (env_file 제거, ports를 ${DB_PORT:-3306}:3306으로 변경)
- server/src/main.ts (.env만 사용하도록 수정)
- server/src/app.module.ts (.env만 사용하도록 수정)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

### 작업 18 - 2025-01-27

#### 요청 내용
synchronize: true 사용하지 않도록 변경 (마이그레이션으로 작업)

#### 수행한 작업
- database.config.ts에서 synchronize를 false로 변경
- data-source.ts는 이미 false로 설정되어 있음
- 모든 스키마 변경은 마이그레이션으로 관리하도록 설정

#### 생성/수정된 파일
- server/src/config/database.config.ts (synchronize: false로 변경)

#### 롤백 여부
- [x] 정상 완료
- [ ] 롤백됨

