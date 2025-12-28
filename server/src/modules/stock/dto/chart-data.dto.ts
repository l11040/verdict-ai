import { ApiProperty } from '@nestjs/swagger';

export class ChartDataPointDto {
  @ApiProperty({
    description: '날짜 (YYYY-MM-DD 형식)',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: '시가',
    example: 150.25,
  })
  open: number;

  @ApiProperty({
    description: '고가',
    example: 152.5,
  })
  high: number;

  @ApiProperty({
    description: '저가',
    example: 149.8,
  })
  low: number;

  @ApiProperty({
    description: '종가',
    example: 151.3,
  })
  close: number;

  @ApiProperty({
    description: '거래량',
    example: 50000000,
  })
  volume: number;

  @ApiProperty({
    description: '수정 종가',
    example: 151.3,
  })
  adjustedClose: number;
}

export class ChartDataResponseDto {
  @ApiProperty({
    description: '주식 심볼',
    example: 'AAPL',
  })
  symbol: string;

  @ApiProperty({
    description: '시작 날짜',
    example: '2024-01-01',
  })
  startDate: string;

  @ApiProperty({
    description: '종료 날짜',
    example: '2024-12-31',
  })
  endDate: string;

  @ApiProperty({
    description: '차트 데이터 포인트 배열',
    type: [ChartDataPointDto],
  })
  data: ChartDataPointDto[];

  @ApiProperty({
    description: '데이터 포인트 개수',
    example: 250,
  })
  count: number;
}
