import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [];

  getAll(): Array<any> {
    return this.tasks;
  }
}
