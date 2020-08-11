import { ApiProperty } from '@nestjs/swagger';

export class ParamIdDto {
  @ApiProperty({ example: 1 })
  id: number;
}
