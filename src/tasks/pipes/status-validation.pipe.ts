import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class StatusValidationPipe implements PipeTransform {
  readonly allowedStatuses: string[] = Object.values(TaskStatus);

  transform(value: string): string {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: string) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
