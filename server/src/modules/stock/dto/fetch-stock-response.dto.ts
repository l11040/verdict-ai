import { ApiProperty } from '@nestjs/swagger';

export class FetchStockResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '주식 데이터를 성공적으로 가져왔습니다. 250개의 새로운 데이터가 저장되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '저장된 데이터 개수',
    example: 250,
  })
  savedCount: number;
}

