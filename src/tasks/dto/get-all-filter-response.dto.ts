import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { TaskStatus } from '../task-status.enum';
import { GetByIdResponseDto } from './get-by-id-response.dto';

class GetAllFilterDataResponseDto extends GetByIdResponseDto {}

export class GetAllFilterResponseDto {
  @ApiResponseProperty({ example: 2 })
  total: number;

  @ApiProperty({
    type: GetAllFilterDataResponseDto,
    isArray: true,
    example: [
      { id: 10, title: 'Hello world!', description: 'The beginning.', status: TaskStatus.OPEN, userId: 2 },
      { id: 11, title: 'Hello world 2!', description: 'The revenge.', status: TaskStatus.OPEN, userId: 1 },
    ],
  })
  data: Array<GetAllFilterDataResponseDto>;
}
