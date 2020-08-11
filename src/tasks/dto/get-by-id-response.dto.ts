import { ApiResponseProperty } from '@nestjs/swagger';
import { TaskStatus } from '../task-status.enum';
import { Task } from '../task.entity';

export class GetByIdResponseDto {
  @ApiResponseProperty({ example: 10 })
  id: number;

  @ApiResponseProperty({ example: 'Hello world!' })
  title: string;

  @ApiResponseProperty({ example: 'The beginning.' })
  description: string;

  @ApiResponseProperty({ example: TaskStatus.OPEN })
  status: TaskStatus;

  @ApiResponseProperty({ example: 2 })
  userId: number;

  static map(task: Task): GetByIdResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
    };
  }
}
