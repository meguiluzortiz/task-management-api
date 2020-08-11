import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateTaskResponseDto {
  @ApiResponseProperty({
    example: '10',
  })
  id: number;

  @ApiResponseProperty({
    example: '2',
  })
  userId: number;
}
