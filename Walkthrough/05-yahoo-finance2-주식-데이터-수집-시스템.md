# yahoo-finance2 주식 데이터 수집 시스템 구현

## 개요

yahoo-finance2 라이브러리를 사용하여 주식 시세 데이터와 기본 정보를 수집하고 MariaDB에 저장하는 시스템을 구현했습니다. DB에 이미 저장된 데이터를 확인하여 중복 조회를 방지하고 필요한 기간만 조회하는 스마트 기간 조정 기능을 포함합니다.

## 주요 기능

1. **주식 시세 데이터 수집**: yahoo-finance2를 통해 일별 OHLCV 데이터 수집
2. **주식 기본 정보 수집**: 회사명, 시가총액, 섹터, 산업 등 기본 정보 수집
3. **스마트 기간 조정**: DB에 이미 있는 데이터를 확인하고 누락된 날짜만 조회
4. **통합 엔드포인트**: 시세 데이터와 기본 정보를 한 번의 요청으로 함께 가져오기

## 기술적 구현

### 1. 데이터베이스 스키마

#### Stock 엔티티 (주식 시세 데이터)
- `symbol`: 주식 심볼 (예: AAPL, TSLA)
- `date`: 날짜
- `open`, `high`, `low`, `close`: OHLC 데이터
- `volume`: 거래량
- `adjustedClose`: 조정 종가
- `dividendAmount`: 배당금
- `splitCoefficient`: 주식 분할 계수
- `symbol`과 `date`에 복합 유니크 제약 조건

#### StockInfo 엔티티 (주식 기본 정보)
- `symbol`: 주식 심볼 (유니크)
- `longName`, `shortName`: 회사명
- `marketCap`: 시가총액
- `sector`, `industry`: 섹터 및 산업
- `currency`, `exchange`: 통화 및 거래소
- `currentPrice`, `previousClose`: 현재가 및 전일 종가
- `dayLow`, `dayHigh`: 당일 고저가
- `volume`: 거래량
- `fiftyTwoWeekLow`, `fiftyTwoWeekHigh`: 52주 고저가
- `longBusinessSummary`: 사업 요약

### 2. 핵심 로직

#### 스마트 기간 조정 알고리즘
```typescript
// 요청한 기간의 각 날짜를 확인하여 누락된 날짜만 조회
1. 요청한 기간 내의 기존 데이터 조회
2. 기존 데이터의 날짜를 Set으로 변환하여 빠른 조회
3. 요청한 기간의 각 날짜를 순회하며 누락된 날짜 확인
4. 누락된 날짜를 연속된 기간으로 그룹화
5. 각 누락된 기간만 yahoo-finance2 API로 조회
```

#### 데이터 수집 프로세스
- 날짜 미지정 시: 오늘 기준 1년치 데이터 자동 조회
- 날짜 지정 시: 지정한 기간의 데이터 조회
- 기존 데이터 확인: DB에 이미 있는 데이터는 스킵
- 병렬 처리: 시세 데이터와 기본 정보를 동시에 가져오기

### 3. 에러 처리

- 주말/공휴일 등 데이터가 없는 경우: 경고 로그만 남기고 계속 진행
- 유효하지 않은 심볼: 명확한 에러 메시지 반환
- yahoo-finance2 API 실패: 상세한 에러 로그 기록

## API 엔드포인트

### 주식 데이터 수집
- `POST /api/stocks/:symbol/fetch?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  - 주식 시세 데이터와 기본 정보를 함께 가져와서 DB에 저장
  - 날짜 미지정 시 오늘 기준 1년치 자동 조회
  - 응답: `{ success, message, savedCount, stockInfo }`

### 주식 기본 정보 조회
- `GET /api/stocks/:symbol/info`
  - 저장된 주식 기본 정보 조회
  - 응답: StockInfo 객체

### 주식 기본 정보 수집
- `POST /api/stocks/:symbol/info/fetch`
  - 주식 기본 정보만 가져와서 저장/업데이트
  - 응답: `{ success, message, data }`

## 생성된 파일

### 엔티티
- `server/src/entities/stock.entity.ts` - 주식 시세 데이터 엔티티
- `server/src/entities/stock-info.entity.ts` - 주식 기본 정보 엔티티

### 모듈
- `server/src/modules/stock/stock.module.ts` - Stock 모듈
- `server/src/modules/stock/stock.service.ts` - 주식 데이터 수집 서비스
- `server/src/modules/stock/stock.controller.ts` - 주식 API 컨트롤러
- `server/src/modules/stock/dto/fetch-stock-response.dto.ts` - 응답 DTO

### 마이그레이션
- `server/migrations/1737900000000-CreateStockTable.ts` - Stock 테이블 생성
- `server/migrations/1737910000000-CreateStockInfoTable.ts` - StockInfo 테이블 생성

## 주요 개선 사항

### 1. 날짜 비교 로직 개선
초기 구현에서는 기존 데이터의 최소/최대 날짜만 확인하여 기간을 조정했지만, 이로 인해 중간에 누락된 날짜를 놓치는 문제가 있었습니다. 개선된 로직은 요청한 기간의 각 날짜를 확인하여 정확히 누락된 날짜만 조회합니다.

### 2. MySQL/MariaDB 호환성
MySQL/MariaDB는 unique constraint를 직접 지원하지 않으므로, unique index를 사용하도록 마이그레이션을 수정했습니다.

### 3. yahoo-finance2 v3 대응
yahoo-finance2 v3에서는 클래스 인스턴스를 생성하여 사용해야 하므로, 서비스에서 인스턴스를 생성하여 사용하도록 수정했습니다.

### 4. 통합 엔드포인트
시세 데이터와 기본 정보를 별도로 가져오던 것을 하나의 엔드포인트로 통합하여, 한 번의 요청으로 모든 데이터를 최신 상태로 유지할 수 있도록 개선했습니다.

## 사용 예시

```bash
# 주식 데이터 가져오기 (오늘 기준 1년치)
POST /api/stocks/AAPL/fetch

# 지정 기간 데이터 가져오기
POST /api/stocks/TSLA/fetch?startDate=2024-01-01&endDate=2024-12-31

# 주식 기본 정보 조회
GET /api/stocks/AAPL/info
```

## 의존성

- `yahoo-finance2`: ^3.1.8 - Yahoo Finance 데이터 수집

