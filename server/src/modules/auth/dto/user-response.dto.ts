import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: 'V1StGXR8_Z5j', description: '사용자 UID' })
  uid: string;

  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
  email: string;

  @ApiProperty({ example: '홍길동', description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({
    example: '2025-01-27T00:00:00.000Z',
    description: '생성일시',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-27T00:00:00.000Z',
    description: '수정일시',
  })
  updatedAt: Date;
}
