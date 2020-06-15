import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllFilterDto } from './dto/get-all-filter.dto';

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

  getAllFiltered(filterDto: GetAllFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAll();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  create(dto: CreateTaskDto): Task {
    const { title, description } = dto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateStatusById(id: string, status: TaskStatus): Task {
    const task = this.getById(id);
    task.status = status;
    return task;
  }

  deleteById(id: string): void {
    const found = this.getById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }
}
