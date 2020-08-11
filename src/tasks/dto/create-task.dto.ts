import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTaskDto {
  @ApiProperty({
    example: 'Hello world!',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'The beginning!',
  })
  @IsNotEmpty()
  description: string;
}
