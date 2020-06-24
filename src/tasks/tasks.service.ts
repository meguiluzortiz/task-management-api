import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllFilterDto } from './dto/get-all-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAll(filterDto: GetAllFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getAll(filterDto, user);
  }

  async getById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createEntity(dto, user);
  }

  async updateStatusById(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteById(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
