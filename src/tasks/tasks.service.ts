import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      description: 'A Hello World tale',
      id: 'ef607900-ae82-11ea-bcfc-2bf91a1b69ff',
      status: TaskStatus.OPEN,
      title: 'Hello World',
    },
  ];

  getAll(): Task[] {
    return this.tasks;
  }

  getById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  create(dto: CreateTaskDto): Task {
    const { title, description } = dto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    console.log(task);
    this.tasks.push(task);
    return task;
  }

  updateById(id: string, status: TaskStatus): Task {
    const task = this.getById(id);
    task.status = status;
    return task;
  }

  deleteById(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
